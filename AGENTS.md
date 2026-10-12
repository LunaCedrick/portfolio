# AGENTS.md

Instructions for AI coding agents (Codex) working on this repository. The owner is Cedrick Luna.

## What this is
A personal portfolio styled as a terminal. A visitor lands on an intro screen with a `$ whoami` button, which opens a terminal. Typing commands (or tapping the chips below it) moves between scenes. A "stage" panel beside the terminal shows the visual content for each scene. On phones the stage stacks above the terminal.

## Deployment
Live at https://ced-builds.vercel.app/ (SITE_URL). Vercel deploys this repository as a static site: no build command, no output directory. Work on a branch named `final-touches` and open a pull request instead of pushing to `main`; Vercel will create a preview URL for the branch.

## Hard constraints
- Plain HTML, CSS, and vanilla JavaScript. No framework, no bundler, no build step, no runtime dependencies. Do not add any unless the owner asks.
- Keep the file structure below. Keep behavior unchanged unless a task says otherwise. Fix and polish; do not redesign.
- Keep the visual identity: warm dark theme by default (cream light theme via the `theme` command), terracotta accent, IBM Plex Mono, calm and slow motion.
- Respect `prefers-reduced-motion`, keep everything keyboard accessible, and keep touch targets at least 44px on phones.
- Never invent facts about the owner. If content looks wrong or is missing, list it in your final report instead of guessing.
- The Web3Forms access key in `js/app.js` (`W3F_KEY`) is deliberately public. Never remove, change, rotate, or log it, and never overwrite `js/app.js` from another copy.
- Privacy: never show the owner's employer name, phone number, or home address anywhere on the site. The role line is exactly "Associate Software Engineer, Philippines".

## File map
- `index.html`: shell, meta tags, intro screen, `<noscript>` fallback
- `css/styles.css`: all styles and both themes (CSS variables on `:root`, `[data-theme]`)
- `js/app.js`: all behavior and all content
- `assets/images/`: screenshots and Oracle badges (webp), `assets/og-image.png` (1200x630 sharing card)
- `assets/icons/`, `favicon.ico`, `site.webmanifest`: favicon and app icons
- `assets/Cedrick_Luna_Resume.pdf`: resume download (contains a phone number, owner's decision)
- `dev/smoke-test.js`: simulated-browser test (not part of the site)

## How `js/app.js` works
- Routes are hash based: `#/about`, `#/skills`, `#/certs`, `#/projects`, `#/projects/<empower|taskly|weather|kiosk>` with optional `/how`, `/features`, `/stack`, `#/contact`, `#/contact/write`, `#/resume`. Root `#/` is the home scene.
- `enter(path, typedCommand)` changes scene: fades the terminal, sets the `split` class on `#wrap` for every scene except home, fills the stage with `stageHTML(path)`, then prints the terminal lines from `SC` or `projScene(path)`.
- `run(command, typed)` parses commands. `dest()` maps command arguments to routes. `nav()` wraps navigation. `CMD` is the command table. `chips()` builds the buttons under the terminal.
- Content constants: `P` (projects, with diagram `parts`, `feats`, `stack`, `links`), `SKILLS`, `TL`, `CERTS`, `CT`, `SC`.
- The background is a canvas of drifting code characters plus a cursor-following spotlight. `spT` slows it during scene changes.
- `W3F_KEY` holds the Web3Forms access key. The contact composer posts to `https://api.web3forms.com/submit`; with no key it falls back to opening a `mailto:` link.
- Commands: `help, whoami, about, skills, certs, projects, open <name>, overview, how [part], features, stack, back, ls, resume, contact, send, copy email, theme, clear`.

## Run and test
- Serve locally: `python3 -m http.server 8000` in the repo root, then open http://localhost:8000.
- Smoke test (no browser needed): `cd dev && npm i jsdom --no-save && node smoke-test.js`. It must pass fully before and after your changes. It cannot judge layout, so also check in a real browser.

## Final-touch tasks
Work through these in order, one small commit per task.
1. **Sharing card (already added).** `index.html` contains `og:url`, canonical, `og:image` (https://ced-builds.vercel.app/assets/og-image.png), image size and alt text, `og:site_name`, and the Twitter large-image tags. Only verify them, and confirm the image URL loads on the live site.
2. **Contact form reply-to.** In `js/app.js`, the Web3Forms request body must include `replyto: d.email` next to `email: d.email`. Add it if it is missing. Do not touch the key.
3. **Real-browser QA.** At 1440, 1024, 768, and 390 px wide, in Chromium, Firefox, and WebKit if available, walk through: intro and launch, every command, every project and every tab, clicking every diagram part, the composer, the theme toggle, and a direct load of a deep link such as `#/projects/kiosk/how`. Fix only genuine layout, overflow, and spacing bugs. Check there is no horizontal scroll and that the stage scrolls (thin scrollbar) when content is taller than it.
4. **Accessibility.** Verify WCAG AA contrast in both themes, visible focus styles, sensible focus order, and that the live-log region does not announce excessively. Diagram parts are keyboard operable (Enter or Space).
5. **Performance.** Run Lighthouse (mobile). Target 90+ performance and 100 for accessibility, best practices, and SEO. Give `<img>` elements explicit `width` and `height` to avoid layout shift. Keep the canvas cheap on phones.
6. **SEO basics.** Add `robots.txt` and a one-URL `sitemap.xml` for https://ced-builds.vercel.app/ (hash routes are not indexable). Add JSON-LD `Person` markup: name, jobTitle "Associate Software Engineer", sameAs links to LinkedIn and GitHub, addressCountry PH. No employer, no phone.
7. **Hosting headers (optional).** Add a `vercel.json` with long-cache headers for `assets/` and basic security headers. If you add a Content-Security-Policy, allow `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, and `https://api.web3forms.com`, and test the contact form afterwards.
8. **Copy review.** Fix typos and unclear wording only. Keep the calm, neutral voice. Do not change meaning.

## Open items for the owner (report these, do not guess)
- Kiosk Overview has no photo.
- Kiosk Stack row "Python: Controller logic" is an assumption.
- Weather Dashboard role is shown as "Personal project".
- Taskly has no live link yet (in development).
- Java and C++ show "Studied during my Computer Engineering degree."
- The resume PDF does not yet list the current job or the Oracle certifications.

## Definition of done
Smoke test passes. No console errors. No horizontal scroll at 390 px. Contrast passes in both themes. Lighthouse targets met or the gap explained. The final report lists every change made, anything you chose not to change and why, and the open items above.
