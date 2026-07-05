# Mahaboob Basha Pamidi Portfolio

A personal portfolio website built with HTML, CSS, and Vanilla JavaScript. It includes dark/light theme switching, responsive navigation, animated background particles, section reveal animations, project filtering, and contact form validation.

## Features

- Dark / Light theme switching with persisted user preference
- Responsive mobile navigation and mobile menu
- Animated hero typing effect and scroll reveal animations
- Particle-based interactive animated background
- Project filtering by category
- Contact form validation with success popup

## Run Locally

1. Open the project folder in a terminal.
2. Start a local server:

```bash
cd "Portfolio using HTML & CSS"
python -m http.server 8000
```

3. Open your browser to:

```text
http://localhost:8000
```

## Git Commands

Use these commands to initialize, commit, and push this project:

```bash
git init
git add .
git commit -m "Add portfolio files"
git branch -M main
git remote add origin https://github.com/Mahaboob1115/Portfolio.git
git push -u origin main
```

## Folder Structure

- `index.html` — main page markup
- `style.css` — responsive portfolio styling
- `script.js` — interactive site behavior
- `vercel.json` — deployment configuration for Vercel

## Deployment

This repository includes `vercel.json` for easy deployment on Vercel. Connect the GitHub repository to Vercel to publish the site.

## Notes

- The portfolio website is built as a static HTML/CSS/JS project.
- The hero profile image currently uses a styled placeholder to avoid broken local asset references.
