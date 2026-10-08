// Netlify Function: serves the Supabase connection from Netlify Environment variables,
// so the keys are not stored in GitHub and no device needs manual setup.
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || ''
  })
});
