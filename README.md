# KYRA. — Developer Portfolio

Personal portfolio built with **HTML, CSS and JavaScript**.

## Features

- Responsive sections for Home, About Me, Skills, Projects and Contact
- English, Slovak and Danish languages
- Light/dark theme switch with saved preference
- Project and section search
- Contact form with a pre-filled email using `mailto:`
- Separate Blog page **LOADING**

## Run locally

Open `index.html` in a browser, or serve the project directory with a local HTTP server (recommended):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

## Project structure

```text
index.html        Main portfolio page
blog.html         Blog placeholder page
styles.css        Shared styling and responsive layout
script.js         Main-page interactions
blog.js           Blog-page interactions
translations.js   EN / SK / DA translation strings
language.js       Language selection and text replacement
images/           Favicon, logos and project screenshots
CV - Marek Pavlus.pdf
```

## Languages

The site uses **one HTML page per view**, not separate HTML files per language.
Use `?lang=en`, `?lang=sk`, or `?lang=da` in the URL, or select a language in the menu. The choice is saved in browser `localStorage`.

To add translated text, add a matching key in each language in `translations.js`, then reference that key with `data-language`, `data-language-html`, or `data-language-attr` in HTML.

## Notes

- The Blog **LOADING** screen is intentional.
- The contact form opens the visitor's email application; it does not send mail from a server.
- Some icons and fonts are loaded from external CDNs, so they require an internet connection.
- The project is currently a static website; no build step or package installation is required.
