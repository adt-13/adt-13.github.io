# Migration Notes

This version keeps the clean style of the original Laravel portfolio but converts the project to a React + FastAPI structure.

## Main design decision

The previous generated version placed too much information on the home page. This update returns to the original simple portfolio idea:

- Home: hero + one featured project only
- Projects: all project cards
- Project Details: one dedicated page per project
- Skills: skills and education
- Contact: contact details and demo form

## Private-code project strategy

The following projects are intentionally presented as case studies:

1. Comparative Analysis of ANN and SNN for ECG-Based Arrhythmia Detection on ESP32-S3
2. Electronics Learning Platform
3. Electronics Simulation Engine

Each one has a source-code notice explaining that the code is private due to academic or commercial reasons. This is a professional way to show work without exposing repositories.

## No extra routing package

To keep the project simple and fast, this version does not use `react-router-dom`. The routing is handled inside `App.jsx` with browser history. This keeps the dependency list small.

If deploying to GitHub Pages, direct refresh on `/projects/...` may need SPA fallback configuration. For a quick portfolio deployment, Netlify or Vercel handles this more easily with a redirect rule.
