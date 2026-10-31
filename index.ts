// Supabase Edge Function: sends a Web Push to the devices of everyone an alert is addressed to,
// so the phone shows the notification even when Shop Manager is closed.
// Triggered by a Database Webhook (INSERT on app_records). See PUSH-SETUP.md.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const TABLE = Deno.env.get("RECORDS_TABLE") ?? "app_records";
webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

// who gets it: '*' = every subscribed device, otherwise the listed user ids
export const recipients = (subs: any[], to: string[]) =>
  subs.filter((s) => to.includes("*") || to.includes(s.data?.userKey));

Deno.serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  const rec = body.record;
  if (body.type !== "INSERT" || !rec || rec.table_name !== "alerts" || rec.deleted) return new Response("skip");
  const a = rec.data ?? {};
  if (!Array.isArray(a.to)) return new Response("skip");
  // an old row re-inserted by a resync must not ring phones again
  if (Date.now() - Date.parse(a.createdAt) > 10 * 60 * 1000) return new Response("old");

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rows } = await sb.from(TABLE).select("id,data").eq("table_name", "pushSubs").eq("deleted", false);
  const payload = JSON.stringify({
    title: (a.urgent ? "🚨 " : "🔔 ") + (a.title || "Alert"),
    body: a.message || "",
    tag: "alert-" + a.id,
  });
  const dead: string[] = [];
  await Promise.all(recipients(rows ?? [], a.to).map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.data.endpoint, keys: s.data.keys }, payload, { TTL: 86400, urgency: "high" });
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) dead.push(s.id); // phone removed the subscription
    }
  }));
  if (dead.length) {
    await sb.from(TABLE).upsert(dead.map((id) => ({ id, table_name: "pushSubs", data: {}, deleted: true, updated_at: new Date().toISOString() })), { onConflict: "id" });
  }
  return new Response("sent");
});
