# Cedrick Luna - Portfolio

A responsive, terminal-style portfolio built with plain HTML, CSS, and JavaScript. It has no build step or package dependencies.

## Run locally

From the project folder, start Python's static file server:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. If port `8000` is already in use, choose another port, such as `8001`, and open the matching URL. Stop the server with `Ctrl+C`.

You can also open `index.html` directly, though running a local server gives the most reliable experience for browser features and file paths.

## Project files

```text
index.html                  Page shell, metadata, and introduction
css/styles.css              Layout, responsive styles, and themes
js/app.js                   Portfolio content and interactions
assets/Cedrick_Luna_Resume.pdf
assets/images/              Project screenshots and certification badges
```

## Update portfolio content

Most content is kept in constants in `js/app.js`:

- `P`: project descriptions, diagrams, features, technology stacks, and links
- `SKILLS`: skill groups, proficiency ratings from 1 to 5, and project context
- `TL`: About timeline
- `CERTS`: certifications and badge image paths
- `CT`: contact cards
- `SC`: terminal text shown for each page
- `RESUME`: path to the downloadable resume

The contact form's Web3Forms access key is configured in `W3F_KEY`. The form submits messages through Web3Forms. If the key is removed, the Send action opens the visitor's email app instead. The post-submit confirmation text is in the `done` function.

## Deploy to Vercel

This is a static site and does not need a build command:

1. Push the contents of this folder to a Git repository, with `index.html` at the repository root.
2. Import the repository in Vercel.
3. Select **Other** as the framework preset. Leave the build command empty and use the project root as the output directory.
4. Deploy. Add a custom domain in the project's domain settings if desired.

## Before publishing

- Review `assets/Cedrick_Luna_Resume.pdf` to make sure it reflects the current role, certifications, and preferred contact details.
- Add `og:url` and `og:image` metadata in `index.html` once the production domain and a 1200 x 630 social preview image are ready.
- Confirm project descriptions and skill ratings reflect your experience.
