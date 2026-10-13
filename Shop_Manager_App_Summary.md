# Shop Manager (Superbase) — App Summary
Version 1.0.64 · last updated 2026-10-09 · single-file HTML app (`index.html`) · installable PWA · database: Supabase · hosting: Netlify · source: GitHub `wahid0018/shop-manager`
Owner: Wahid, ABA Computers, Varanasi.

## 0. App introduction (short, for staff or new users)
Shop Manager is the billing and shop-management app for ABA Computers. Use it to make GST invoices and Non-GST vouchers, record purchases and services, track warranty and repair items, watch stock and dues, and print or share any bill as a PDF. It works on a phone, tablet or PC, installs like a normal Android app, and keeps every device in step through one cloud database. Admin has full control. Staff see only the sections Admin allows, and anything Staff change on an existing record goes to Admin for approval.

## 1. What it is
A shop management system for a computer sales and service business. Everything lives in one `index.html` file. It runs in any browser, installs on Android as an app, and syncs its data to a Supabase cloud database so every device sees the same records.

## 2. Files in the project
| File | Purpose |
|---|---|
| `index.html` | The whole app. The version is the `APP_VERSION` line inside it (also shown under the app name in the side panel and in the page title). |
| `version.json` | `{"version":"x.y.z"}`. Optional, the app also reads the version from `index.html`. |
| `sw.js` | Service worker (offline app shell, network-first; never caches Supabase calls or `version.json`). |
| `manifest.webmanifest` + 3 icons | Makes the app installable (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`). The icons are placeholders (amber square with "SM"); replace with the shop logo, same file names. |
| `netlify.toml` + `netlify/functions/config.js` | Netlify function that serves the Supabase URL and key from Netlify environment variables. |
| `config.json` | Fallback: `{"supabaseUrl":"","supabaseKey":""}` next to `index.html` if the function is not used. |
| `assetlinks.json` | Template for removing the browser bar in an Android app built with PWABuilder. |

## 3. Roles and access
- **Admin:** full access. Edits and deletes records directly, approves Staff requests, and can hide any section from their own menu (Shop Settings → Admin Visible Sections).
- **Staff (user):** sees only the sections Admin ticks (Shop Settings → Staff Access Control). Edits and deletes on records go to Admin as approval requests; Staff see them as "In process / Approved / Rejected" under **My Approvals**.
- There is no manager password for edit and delete any more. It is approval-based only.
- **New Warranty / Out Repair items** are created directly by Staff. Only edits, status changes and amount changes need approval.
- Staff cannot see the Salary Register, and cannot see the Received Items container in Warranty.
- Software Renewals and Pending Dues Register can be enabled or disabled separately for Admin and Staff. Renewals starts hidden for Staff.

## 4. Sections and features
- **Dashboard:** date filter and compact summary cards (Product Sales, Outstanding Dues, Service Revenue, Purchase), Top Selling Products, low stock, negative stock, invoices in range, and a **Recent Updates & Transactions** panel. Every table shows 5 rows with Show more. (The employee filter and Revenue by Employee were removed on request.)
- **Purchase / Sale (Invoice, GST) / Sales Voucher (Non-GST) / Service Sale / Quotation–Challan / Purchase Payment Voucher.**
- **Registers:** Purchase, Sales, Non-GST Sale, Service, with editable paid amounts and auto-calculated dues.
- **Pending Dues Register:** unpaid Sales, Non-GST and Service in one list sorted by date, with filters, age in days, View and WhatsApp Remind. It is separate; no existing register was changed.
- **Warranty / Out Repair:** register of pending items, an admin-only collapsible **Received Items** container (5 rows plus View more), received voucher and manual print.
- **Inventory:** products with barcodes. In Purchase and Inventory the **📷 Scan** button reads barcodes with the phone camera (browser asks for permission; needs https).
- **Customers:** name, phone, GSTIN, address, **State** (all Indian states with GST codes, auto-filled from the GSTIN), **Party Reference**, and **Fill GSTIN Details** (RapidAPI GST lookup; fills name, address and state only).
- **Employees** and **Salary Register (admin only):** monthly salary per employee, Salary and Advance entries with payment mode and date, monthly summary (advance, paid, balance due).
- **Software Renewals:** client list (aliases, contact, GSTIN, address, plan, default amount, period), financial-year view, payment with or without GST, mode and date. Paid clients move to a collapsed Paid section; clients not renewing move to a collapsed Not Renewing section. Clients can be deleted. A5 renewal voucher in the ABA Computers format.
- **To-Do List, Pending Approvals** (admin), **My Approvals** (staff).
- **UI Settings (everyone):** theme (10 themes), Dark Mode (Auto follows the device / Light / Dark), UI font size, App Updates (check for updates), Install as App. Saved per user.
- **Shop Settings (admin):** shop details, Staff Access Control, Admin Visible Sections, Cloud Database (Superbase) connection.

## 5. Printing, PDF and sharing
- Page sizes A4, A5, A6 for invoices and vouchers. The sheet fills the selected page, with totals and footer at the bottom.
- Every print screen has **Print**, **📄 PDF** (download) and **📤 Share PDF** (opens the phone's share sheet). File name is `Party name_Voucher number.pdf`.
- Share PDF builds the PDF in the background as soon as an invoice opens, and again after a page-size change. The button shows "Preparing PDF…" and is disabled until ready, because Android only opens the share sheet right after a tap. If a share is refused, a "PDF ready" panel offers Share, Save and Open.
- Warranty receipt and renewal voucher also have PDF and Share buttons. They build the PDF after the tap, so on a slow phone they can land on the "PDF ready" panel.
- The PDF library loads from the internet the first time it is used.

## 6. Database (Supabase)
- All data is stored in one table with columns `id`, `table_name`, `data`, `deleted`, `updated_at` (rows are upserted; deletes are saved with an empty object in `data` and `deleted=true`).
- Every save shows a thin overlay, saves to Supabase, reads the records back to check, then shows an animated tick. If it fails, a full-screen **FATAL: Superbase sync failed** overlay blocks entry until you retry or reload.
- Realtime updates from other devices are merged in the background. The page does not redraw while you are typing, have a dialog open, or the save overlay is showing.
- If Superbase is unavailable only the Admin recovery mode works.
- **Credentials on the hosting:** the app first asks the website for the connection (Netlify function, then `config.json`). If found, every device connects automatically and Shop Settings shows "Managed by your hosting". If not, it falls back to credentials saved in that device's browser.

## 7. Hosting and release process
- **Hosting:** Netlify. For the Netlify function to run, the site must be linked to the GitHub repo (Site configuration → Build & deploy → Continuous deployment). Drag-and-drop deploys do not run functions.
- **Netlify environment variables** (Site configuration → Environment variables): `SUPABASE_URL` and `SUPABASE_ANON_KEY`, then Trigger deploy.
- **GitHub:** `https://github.com/wahid0018/shop-manager` (public). The repo or live site may be behind the latest file; compare the version under the app name in the side panel with 1.0.64.
- **Standing rule:** do not upload or update anything on GitHub until the owner says so. GitHub tools are now available inside the Claude chat, so Claude can push when asked. Otherwise upload by hand, or through Claude Code on the web.
- **To release an update:** change `APP_VERSION` in `index.html` (and `version.json`), upload both to the repo (or deploy to Netlify), upload `version.json` last.
- **How devices update:** the app reads `APP_VERSION` from the published `index.html` (and `version.json`), checks on opening, every 5 minutes and when you return to the app, and shows "New version available — Update now". UI Settings → App Updates has **Check for updates**, **Update now** and **Reload fresh copy**. Updates work only from the hosted https address, not from a saved file.
- **Android:** open the hosted site in Chrome and choose Install app. For an APK, use PWABuilder (pwabuilder.com) with the hosted address; it makes a signed APK and an AAB. Keep the signing key and password safe. Fill `assetlinks.json` and host it at `/.well-known/assetlinks.json` to remove the address bar.

## 8. Interface notes
- Subtle colour scheme, fast animations, minimal shadows, responsive from phone to wide screens.
- Desktop: compact fixed side panel (collapses only with the ◂ button, and expands on hover while collapsed). Coloured line icons for every section.
- Top bar: compact and pinned (sticky). On phones it hides when scrolling down and returns on scrolling up. The theme picker is not in the top bar; it lives in UI Settings.

## 9. Security notes (please read)
- The app's source is visible to anyone who opens the site. The RapidAPI GST key is written in the source. Generate a new key before the repo or site is widely shared.
- The default Admin password is still written in the source code. Change it (or move admin sign-in to Supabase login).
- The Supabase anon key is visible in the browser by design. Protect your data with row-level security in Supabase, otherwise anyone who opens the site can read or change the data.
- The GitHub repo is public. Keep filled-in Supabase credentials out of it (use the Netlify environment variables).

## 10. Known limits
- WhatsApp cannot be told which contact to send a file to, so Share PDF opens the system share sheet and you pick the chat.
- Staff edits to customers and to-do items save directly. Only customer deletes need approval.
- Updating a single row without redrawing the list is not done everywhere.
- Camera barcode scan and installing need https.
- Nothing was tested against the real Supabase, Netlify, GST service or a real Android phone. Tests ran in a headless browser with simulated responses, so check each new feature once on the live site.

## 11. Version history (main milestones)
| Version | What changed |
|---|---|
| 1.0.26 | Original uploaded app. |
| 1.0.27 | Invoice, voucher print fixes: A4/A5/A6 fit the page, aligned tables, footer at bottom. |
| 1.0.28–1.0.30 | Subtle colours, fast animations, minimal shadows, responsive fixes, UI Settings, compact top bar and side panel, dark mode, coloured line icons. |
| 1.0.33 | Camera barcode scan, installable PWA files. |
| 1.0.35–1.0.37 | Superbase Save & Connect fix, default admin caption removed, approval-only edit/delete, Admin Visible Sections, My Approvals, customer-delete sync fix. |
| 1.0.38–1.0.39 | Save overlay with cloud check, FATAL error, Recent Updates, dark-mode popups. |
| 1.0.40–1.0.43 | Version label and auto-update, dashboard Show more, warranty approve/reject fix, compact dashboard, Received Items container. |
| 1.0.44–1.0.46 | Salary Register, warranty approval for staff edits, new warranty direct for staff, Software Renewals. |
| 1.0.47–1.0.51 | Update checker and App Updates panel, sidebar hover-expand. |
| 1.0.52–1.0.55 | Device dark mode (Auto), mobile polish, PDF export, Pending Dues Register, State and Party Reference, GSTIN fill, Share PDF. |
| 1.0.56–1.0.58 | Share sheet reliability (background PDF build, fallbacks), credentials stored on hosting. |
| 1.0.59–1.0.60 | Share PDF button disabled until the PDF is ready, re-checked after page-size changes. |
| 1.0.61 | Warranty / Out Repair register: phone card layout (collapsible form, Due badge, big buttons, dark mode). Invoice PDF and Share PDF no longer clip at the edge on phones (A4/A5/A6). |
| 1.0.64 | Invoice and voucher preview, print and PDF always stay light, even when the app is in dark mode. Fixed the Classic theme showing a light page in dark mode. |
| 1.0.63 | Inventory view modes (Cards, Details table, Grid, remembered per device) with a 2x2 summary. On phones, summary tiles show 2x2 and Purchase, Sales, Non-GST, Service, Dues and other registers show as cards like the Warranty register. |
| 1.0.64 | Pending Dues Register: removed the per-date summary line (rows stay sorted by date). |

## 12. Continuing this project in a new chat
- The master file is `index.html` (same content as `Shop_Manager_Superbase_v1_0_64.html`). Ask Claude to start from that file, bump `APP_VERSION` and `version.json` after each change, and keep the versioned copy.
- Changes were made as small scripted patches and tested in headless Chrome with simulated Supabase, GST and share responses. Keep that habit: test, then deliver.
- Do not re-add things that were removed on purpose: the manager-password prompt, the WhatsApp PDF button, the theme picker in the top bar, the employee filter and Revenue by Employee on the dashboard, the default admin caption and pre-filled admin login.
- Do not upload to GitHub until the owner says so.
- Main data lists inside the app: sales, purchases, vouchers, services, customers, employees, paymentVouchers, warrantyJobs, warrantyRequests, approvalRequests, salaryEntries, renewalClients, renewalEntries, repairProviders.
