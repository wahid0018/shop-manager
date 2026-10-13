# Shop Manager

Billing and shop-management web app (PWA) for ABA Computers. Plain HTML + CSS + JavaScript, no build step.
Database: Supabase. Hosting: Netlify. Installable on Android.

## Project structure
```
index.html                 page shell (markup only) — loads css/ and js/ in dependency order
css/                       base -> responsive -> polish -> components (load order matters)
js/
  config/env.js            ALL environment/deploy settings (keys, table names, timings)
  config/version.js        APP_VERSION (single source of truth)
  core/errors.js           AppErrors: logging, safe(), safe storage/JSON helpers, global handlers
  core/store.js            AppStore: small state store (net, session, ui) with subscribe()
  core/state.js            global containers (DB, cloud flags) and id helpers
  core/db.js               seed, normalise, local storage / recovery
  core/router.js           page titles + route() (renders inside try/catch)
  core/auth.js             login, roles, app start
  services/                cloud.js (Supabase sync), connection-guard.js (offline blocking),
                           updater.js, pdf-share.js
  ui/                      helpers.js (toast, modal, confirm), print.js, theme.js, table-cards.js, ...
  features/                one file per screen/feature (inventory, purchase, sale, voucher, service,
                           registers, warranty, renewals, salary, dues, settings, recycle-bin, ...)
netlify/functions/         config.js (Supabase keys from env vars), gst.js (GST lookup proxy)
tools/                     release.py (bump version), bundle.py (optional single-file build)
sw.js, manifest.webmanifest, version.json, icons
docs/CONVENTIONS.md        naming and coding rules
```
Scripts are classic (non-module) scripts sharing one global scope because the HTML uses inline `onclick`
handlers. Load order in `index.html` is the dependency order — do not reorder.

## Configuration (environment)
* Supabase URL/key: Netlify env vars `SUPABASE_URL`, `SUPABASE_ANON_KEY` (served by `netlify/functions/config.js`),
  or `config.json` next to `index.html`. Never commit real keys.
* GST lookup: set `RAPIDAPI_KEY` on Netlify (served by `netlify/functions/gst.js`), then blank `GST_API.key` in `js/config/env.js`.
* Other values (table name, storage keys, timings, bootstrap admin) live in `js/config/env.js`.

## Release
```
python3 tools/release.py 1.0.68     # updates version.js, version.json and ?v= stamps in index.html
```
Upload everything that changed; upload `version.json` last. Devices poll `version.json` and offer the update.
Optional single file: `python3 tools/bundle.py` -> `dist/shop-manager.html`.

## Behaviour worth knowing
* With Supabase configured, entries need internet: staff cannot log in offline (popup), admin can, with a warning in the top bar; all entries are blocked until the connection returns.
* Deleted records go to the Admin Recycle Bin and can be restored.
* Printing hides the browser URL/date header by using `@page{margin:0}` with padding on the page.
