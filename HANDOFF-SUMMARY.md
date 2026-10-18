# HANDOFF: Thapar-Nav

Paste this file into a new Claude chat and attach the project zips. Read it fully, then wait for me to name the next item. Do not build anything until I do.

## About me and how to work with me
- I know HTML and CSS, I am a beginner at JavaScript and new to deployment. Explain simply, step by step.
- No comments in generated code.
- Never commit or push. Give me the git commands to run myself.
- Keep my existing design and look. Do not redesign pages.
- Deliver files as zips with project-relative paths, and ALWAYS include an updated HANDOFF-SUMMARY.md (this file) in every zip.
- Build only the item I ask for (my usage limit runs out quickly). Test in a real browser when possible and say plainly what could not be tested.

## Project
Campus navigation web app for Thapar. Users: students, teachers (role `staff`) and visitors find places and navigate to them. Admins manage data.

Stack (fixed; MongoDB and Render must stay): plain HTML/CSS/JS (ES modules) client with Leaflet 1.9.4 + OpenStreetMap; Node.js + Express 4 + Mongoose 8 backend on MongoDB Atlas; JWT (HS256) + bcrypt admin login; Render hosting (backend Web Service + static site); GitHub.

## Folder layout (thapar-nav/)
- backend/: src/{app,config,controllers,middleware,models,routes,services,utils}, scripts/create-admin.js, tests/, server.js
- client/: login, user-option, index, places, menu, support (.html), js/, css/, assets/
- admin/: index.html (login), dashboard, campus-data, places-data, path-editor, import-places, settings, student-data-details (old static design, no longer linked), account-settings (.html), top-bar.html, side-bar.html, js/{config,dom,auth,api,login-page,shell,places-page,path-page,csv,import-rules,import-page}.js, css/, assets/
- Docs: README, SETUP-GUIDE, DATABASE-DESIGN, API-REFERENCE, CLIENT-GUIDE, ADMIN-GUIDE, HANDOFF-SUMMARY

## Backend facts
- CORS allow-list from CLIENT_ORIGINS (403 otherwise). Rate limits per 15 min: general 300, login 10, write 120, route 120. Admin passwords at least 10 characters. .env keys: MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_ORIGINS.
- backend/src/config/db.js has a DNS fallback (Google/Cloudflare) for Atlas SRV lookup failures. It works on my PC.
- API: POST /api/clients/ping {clientId,userType,name?,contact?} (public, write limiter); GET /api/clients?type=all|registered|guest&userType&q&page&limit<=100 (admin) -> {count,total,page,totals:{registered,guests},clients}; POST /api/auth/login {username,password} -> {token,expiresIn,admin}; GET /api/auth/me; PUT /api/auth/me {displayName,email,phone,avatar} (admin); PUT /api/auth/password {currentPassword,newPassword} (admin, wrong current password returns 400); GET/POST /api/places; GET/PUT/DELETE /api/places/:id (list params role, category, q, limit<=500, page, includeInactive=true with admin token; returns {count,total,page,places}); GET /api/paths/network, /junctions, /walkways (public); POST /api/places/bulk {mode:skip|update, places:[<=30]} (admin); POST/PUT/DELETE /api/paths/junctions[/:id] and /api/paths/walkways[/:id] (admin); GET /api/route (A*); GET /api/health. Errors: {error, details:[{field,message}]}; duplicates 409.
- Place fields: name (2-120, unique ignoring case), category (academic, hostel, food, admin, library, sports, medical, gate, parking, other), description, aliases (max 10), lat 30.3-30.4, lng 76.3-76.45, visibleTo (student/staff/visitor), openingHours, isEntrance, junction (id or null), isActive.
- Junction: label, lat, lng. Walkway: from, to, distanceMeters (server computed), bidirectional, wheelchairAccessible, name. Deleting a junction removes its walkways and unlinks its places. Editing walkways or junctions refreshes the routing graph.
- Known minor issue: list results from .lean() also contain nameKey and __v (not fixed).

## Status
| Item | Status |
|---|---|
| A setup guide + DB design | Done |
| B backend | Done |
| C client (role pick, map, places, search, details, cache, "server waking up" notice) | Done |
| E1 admin login (username/password, token in sessionStorage, guarded pages, logout, name in top bar) | Done |
| E2 places manager (search, filter, add, in-row edit, delete) | Done |
| E3 walking-paths map editor (add/move/delete junctions, draw walkways, edit flags and names, link places to junctions, overview warnings) | Done |
| D1 live GPS (client/index.html: locate button; map.js: watch, accuracy circle, hideUser; home.js: watchPosition tracking, pauses when tab hidden, permission/no-signal messages) | Done, syntax-checked only, not browser-tested |
| D2 route drawing (route.js handler; Start Route calls /api/route from GPS, or from the first entrance place if off campus; blue line, distance/time banner, clear button, Google Maps fallback on error; places page redirects to index.html?route=<id>) | Done, syntax-checked only, not browser-tested |
| D3 directions (client/js/directions.js builds steps from route coordinates; Directions button in route banner shows the list) | Done, step builder unit-tested, UI not browser-tested |
| D4 from/to (route planner under the map: From and To search boxes, My location button, Change button in banner, directions button on map) | Done, not browser-tested |
| D5 off-route re-route (home.js checkRouteProgress: only for GPS-start routes; re-routes after 3 fixes more than 35 m off the line, 15 s cooldown, ignores fixes worse than 60 m accuracy, shows arrival banner within 25 m; constants in config.js) | Done, distance helper unit-tested, not browser-tested |
| User data (admin/user-data.html, side-bar item 2; lists all clients: name, contact, user type, created on; tabs All/Registered/Guests, search, user-type filter, load more; backend Client model, POST /api/clients/ping public, GET /api/clients admin; client login now asks name + phone/email, or Continue as guest; home page pings once per session with a random clientId from localStorage) | Done, validation smoke-tested only, not run against Atlas or a browser |
| D6 role shortcuts | Not started |
| Admin settings + account settings (campus-data layout; settings now only has Account Settings; account page: profile picture upload resized to 96px JPEG, username read-only, name/email/phone inline edit, change password; backend Admin got displayName/email/phone/avatar, PUT /api/auth/me, PUT /api/auth/password; top bar shows name and picture) | Done; account page browser-tested with a mocked API (Playwright), not run against Atlas. Set profile details with: node scripts/set-admin-profile.js <username> <email> <phone> [name] |
| E4 bulk CSV import (admin/import-places.html; backend POST /api/places/bulk; preview, validation, skip/update existing, handles non-UTF-8 files) | Done |
| F deployment (GitHub, Render backend and static site, set PRODUCTION_API_URL in client/js/config.js and admin/js/config.js, add site addresses to CLIENT_ORIGINS) | Not started |
| G extras (PWA, offline, dark mode, feedback) | Not started |

## Testing so far
D1 to D5 were only syntax-checked (no Leaflet or real GPS available in the test sandbox). Test it on your phone or with Chrome DevTools > Sensors.

E1, E2, E3 and E4 passed real-browser Playwright tests (45 + 34 + 32 checks) against the real Express app with a fake in-memory database. They have NOT been run against my real Atlas database. Admin dashboard stats, student-data-details and account-settings pages are still static designs.

## Notes for the next item
- My campus data is in places-fixed.csv (104 places: hostels, blocks, food, gates, sports, other). Import it with E4 if not yet done, then draw paths (E3) and link places.
- Data flow for navigation: places have a junction link; the network of junctions and walkways must be drawn (E3) and places linked before /api/route can work. The client shows "No places yet" until places are added in the admin panel.
- First step in a new chat: unzip thapar-nav-ABC.zip, then thapar-nav-E.zip, thapar-nav-E3.zip, thapar-nav-E4.zip and thapar-nav-D1.zip and thapar-nav-D2.zip and thapar-nav-D3-D4.zip and thapar-nav-D5.zip and thapar-nav-settings.zip and thapar-nav-userdata.zip and thapar-nav-account.zip and thapar-nav-account-fix.zip over it (later zips overwrite earlier files), skim the code and docs, then ask which item to build.
- Do not ask me to paste database credentials, and do not store them. If I shared them in a chat earlier, I should change my Atlas password.

## Admin logo link
- admin/top-bar.html: the top bar logo is wrapped in a link to dashboard.html (id logo-link), so it works on every admin page loaded through shell.js. Not browser-tested.

## Top bar name across admin pages
- admin/js/shell.js: top bar shows admin.displayName (falls back to username) and the profile picture on every admin page, from the saved session, then refreshes from GET /api/auth/me once per page load and re-saves the session. Not browser-tested.
