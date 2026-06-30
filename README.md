# Adity Portfolio — React + FastAPI

A clean, multi-page portfolio converted from the original Laravel version into a React + FastAPI structure.

## What changed

- The design has been simplified to match the original Laravel portfolio style: clean dark layout, compact cards, simple navigation, and less content on the home page.
- The home page now contains only the hero section and one featured project.
- The Projects page contains the full project list.
- Each project has a dedicated details page.
- The three private-code projects are presented as case-study pages instead of public source-code repositories:
  - Low-Power Cardiac Arrhythmia Detection on ESP32-S3
  - Electronics Learning Platform
  - Electronics Simulation Engine

## Project structure

```txt
adity-portfolio-react-fastapi/
├── backend/
│   ├── data/
│   │   └── portfolio.json
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── public/images/adity.jpg
    ├── src/
    │   ├── components/
    │   │   ├── Contact.jsx
    │   │   ├── Footer.jsx
    │   │   └── Navbar.jsx
    │   ├── data/portfolioData.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    └── package.json
```

## Run the backend

```bash
cd backend
conda activate portfolio-fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```txt
http://localhost:8000
```

API docs:

```txt
http://localhost:8000/docs
```

## Run the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## Important pages

```txt
/                                  Home
/about                             About
/projects                          Projects list
/projects/cardiac-arrhythmia-detection-esp32-s3
/projects/electronics-learning-platform
/projects/electronics-simulation-engine
/skills                            Skills + education
/contact                           Contact
```

## Editing portfolio content

Frontend fallback data is here:

```txt
frontend/src/data/portfolioData.js
```

Backend API data is here:

```txt
backend/data/portfolio.json
```

For now, update both files when changing project content. Later, this can be connected to a database or admin panel.

## Note about private source code

The portfolio intentionally does not expose source code for the defense project and the two SaaS-related projects. Instead, those projects are shown through public case-study pages with overview, problem, role, approach, architecture, tech stack, and source-code notice.
