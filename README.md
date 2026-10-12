# Cedrick Luna | Portfolio

A terminal-style portfolio built with plain HTML, CSS, and JavaScript. There is no build step.

## Structure
- `index.html`: page shell, meta tags, and the intro screen
- `css/styles.css`: all styling, including the dark and light themes
- `js/app.js`: behavior and all of the content
- `assets/images/`: project screenshots and Oracle badges (webp)
- `assets/Cedrick_Luna_Resume.pdf`: the resume download

## Edit the content (all in `js/app.js`)
- `P`: projects (overview text, diagram parts, features, stack, links)
- `SKILLS`: skill groups, levels (1 to 5), and where each was used
- `TL`: the About timeline
- `CERTS`: certifications and their badge images
- `CT`: contact cards
- `SC`: the terminal text for each scene

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy to Vercel
1. Create a GitHub repository and upload the contents of this folder, with `index.html` at the root.
2. In Vercel choose Add New, Project, and import the repository.
3. Set Framework Preset to Other. Leave Build Command and Output Directory empty. Deploy.
4. Optional: add a custom domain under Project Settings, Domains.

## Contact form (Web3Forms), to do later
1. Create an access key at https://web3forms.com.
2. Paste it into `W3F_KEY` in `js/app.js`.
Until a key is set, the Send button opens the visitor's mail app with the message filled in.

## When the final address is known
Add `og:url` and `og:image` meta tags in `index.html` (use an image of 1200 x 630 pixels in `assets/`).

## Notes
- The resume PDF is the software-focused version. It includes a phone number, and it does not yet list the current job or the Oracle certifications. Replace the file in `assets/` at any time, keeping the same name.
- Project and skill content was written from the information provided. Review the wording before publishing.
