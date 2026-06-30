import { useEffect, useMemo, useState } from "react";
import { portfolioData } from "./data/portfolioData";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./components/Contact";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function App() {
  const [data, setData] = useState(portfolioData);
  const [path, setPath] = useState(getPath());
  const [apiStatus, setApiStatus] = useState("fallback");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/portfolio`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("API response was not OK");
        return response.json();
      })
      .then((apiData) => {
        setData(apiData);
        setApiStatus("connected");
      })
      .catch(() => {
        setData(portfolioData);
        setApiStatus("fallback");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleNavigation = () => setPath(getPath());
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  const navigate = (event, to) => {
    event.preventDefault();
    window.history.pushState({}, "", to);
    setPath(getPath());
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const featuredProject = useMemo(() => {
    return data.projects.find((project) => project.slug === data.featuredProjectSlug) || data.projects[0];
  }, [data]);

  let page;
  if (path === "/") {
    page = <Home data={data} featuredProject={featuredProject} navigate={navigate} />;
  } else if (path === "/about") {
    page = <About data={data} />;
  } else if (path === "/projects") {
    page = <ProjectsPage projects={data.projects} navigate={navigate} />;
  } else if (path.startsWith("/projects/")) {
    const slug = path.split("/").filter(Boolean)[1];
    const project = data.projects.find((item) => item.slug === slug);
    page = project ? <ProjectDetails project={project} navigate={navigate} /> : <NotFound navigate={navigate} />;
  } else if (path === "/skills") {
    page = <SkillsPage data={data} />;
  } else if (path === "/contact") {
    page = <Contact profile={data.profile} apiUrl={API_URL} apiStatus={apiStatus} />;
  } else {
    page = <NotFound navigate={navigate} />;
  }

  return (
    <div className="app-shell">
      <Navbar profile={data.profile} path={path} navigate={navigate} />
      <main>{page}</main>
      <Footer profile={data.profile} />
    </div>
  );
}

function Home({ data, featuredProject, navigate }) {
  const { profile } = data;

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-tag">{profile.headline}</p>
          <h1>
            Hi, I’m <span>{profile.name}</span>
          </h1>
          <p className="hero-subtitle">{profile.summary}</p>
          <div className="hero-buttons">
            <a href="/projects" className="btn btn-primary" onClick={(event) => navigate(event, "/projects")}>
              View Projects
            </a>
            <a href="/contact" className="btn btn-outline" onClick={(event) => navigate(event, "/contact")}>
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-image">
          <img src={profile.image} alt={`Portrait of ${profile.name}`} />
        </div>
      </section>

      <PortfolioSnapshot data={data} />

      <section className="page-section featured-section">
        <div className="section-topline">
          <p className="small-label">Featured Project</p>
          <h2 className="section-heading-large">{featuredProject.shortTitle}</h2>
        </div>

        <article className="featured-card">
          <div>
            <p className="project-meta">{featuredProject.type} · {featuredProject.status}</p>
            <p>{featuredProject.description}</p>
            <p className="private-note">{featuredProject.caseStudy?.sourceNotice}</p>
          </div>
          <a
            href={`/projects/${featuredProject.slug}`}
            className="btn btn-primary"
            onClick={(event) => navigate(event, `/projects/${featuredProject.slug}`)}
          >
            View Case Study
          </a>
        </article>
      </section>
    </>
  );
}


function PortfolioSnapshot({ data }) {
  const privateCaseStudies = data.projects.filter((project) => project.visibilityType === "private").length;
  const saasProjects = data.projects.filter((project) =>
    project.type.toLowerCase().includes("saas")
  ).length;
  const defenseProjects = data.projects.filter((project) =>
    project.type.toLowerCase().includes("defense")
  ).length;

  const stats = [
    {
      value: `${privateCaseStudies}`,
      label: "Private Case Studies"
    },
    {
      value: `${saasProjects}`,
      label: "SaaS Product Directions"
    },
    {
      value: `${defenseProjects}`,
      label: "Academic Defense Project"
    },
    {
      value: "Ongoing",
      label: "Research + Product Work"
    }
  ];

  const focusAreas = [
    {
      title: "AI/ML Systems Development",
      description:
        "Building practical machine learning workflows, model comparison pipelines, and project-ready AI systems."
    },
    {
      title: "Embedded AI",
      description:
        "Exploring ESP32-S3 deployment, ECG signal classification, and low-power edge AI constraints."
    },
    {
      title: "Full-Stack Development",
      description:
        "Designing React and FastAPI-based products with clean interfaces, APIs, and scalable product structure."
    }
  ];

  return (
    <section className="page-section snapshot-section">
      <div className="snapshot-stats">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>

      <div className="focus-grid">
        {focusAreas.map((area) => (
          <article className="focus-card" key={area.title}>
            <h2>{area.title}</h2>
            <p>{area.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function About({ data }) {
  return (
    <section className="page-section">
      <h1 className="page-title">About Me</h1>

      <div className="two-column">
        <div className="content-block">
          <p>{data.profile.about}</p>
          <p>
            My current work is centered around private-code projects: Make to Break, a project-based maker learning platform; an electronics simulation engine; and an academic defense project on ECG-based arrhythmia detection. I present these as case studies so the work can be reviewed professionally without exposing private source code.
          </p>
          <p>
            I am especially interested in building practical systems where software engineering, machine learning, and embedded hardware decisions connect together.
          </p>
        </div>

        <div className="info-card">
          <h2 className="section-heading">Quick Info</h2>
          <ul className="info-list">
            <li><span>Full Name:</span> {data.profile.name}</li>
            <li><span>Focus:</span> AI/ML, Full-Stack & Embedded AI</li>
            <li><span>Based in:</span> {data.profile.location}</li>
            <li><span>Email:</span> {data.profile.email}</li>
            <li><span>GitHub:</span> <a href={data.profile.github} target="_blank" rel="noreferrer">adt-13</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProjectsPage({ projects, navigate }) {
  return (
    <section className="page-section">
      <h1 className="page-title">Projects</h1>
      <p className="page-intro">
        A selected list of public projects, private SaaS work, and academic research. For private-code work, I use case-study pages instead of exposing the repository.
      </p>

      <div className="card-grid">
        {projects.map((project) => (
          <article className="card" key={project.slug}>
            {project.screenshots?.[0]?.src && (
              <img className="project-card-image" src={project.screenshots[0].src} alt={`${project.shortTitle} preview`} />
            )}
            <p className="project-meta">{project.type} · {project.status}</p>
            <h2>{project.shortTitle}</h2>
            <p>{project.description}</p>
            <p className="card-tech">Tech: {project.tech.join(", ")}</p>
            <div className="card-actions">
              <a
                href={`/projects/${project.slug}`}
                className="text-link"
                onClick={(event) => navigate(event, `/projects/${project.slug}`)}
              >
                View Details
              </a>
              {project.links?.github && (
                <a href={project.links.github} target="_blank" rel="noreferrer" className="text-link muted-link">
                  GitHub
                </a>
              )}
              {project.links?.demo && (
                <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-link muted-link">
                  Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectDetails({ project, navigate }) {
  return (
    <section className="page-section project-detail">
      <a href="/projects" className="back-link" onClick={(event) => navigate(event, "/projects")}>← Back to Projects</a>

      <div className="project-header">
        <p className="project-meta">{project.type} · {project.status}</p>
        <h1 className="page-title">{project.shortTitle}</h1>
        <p className="page-intro">{project.description}</p>
      </div>

      <div className="two-column project-layout">
        <div className="content-block">
          {project.caseStudy?.overview && (
            <section className="detail-block">
              <h2 className="section-heading">Case Study Overview</h2>
              <p>{project.caseStudy.overview}</p>
            </section>
          )}

          <section className="detail-block">
            <h2 className="section-heading">Problem</h2>
            <p>{project.problem}</p>
          </section>

          <section className="detail-block">
            <h2 className="section-heading">My Role</h2>
            <p>{project.role}</p>
          </section>

          <section className="detail-block">
            <h2 className="section-heading">Approach</h2>
            <p>{project.approach}</p>
          </section>

          {project.caseStudy?.sections?.map((section) => (
            <section className="detail-block" key={section.title}>
              <h2 className="section-heading">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          <section className="detail-block">
            <h2 className="section-heading">Key Features</h2>
            <ul className="skills-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          {project.architecture && (
            <section className="detail-block">
              <h2 className="section-heading">High-Level Architecture</h2>
              <div className="architecture-flow">
                {project.architecture.map((step) => (
                  <span key={step}>{step}</span>
                ))}
              </div>
            </section>
          )}

          {project.screenshots?.length > 0 && (
            <section className="detail-block">
              <h2 className="section-heading">Product Screenshots</h2>
              <div className="screenshot-grid">
                {project.screenshots.map((screenshot) => (
                  <figure className="screenshot-card" key={screenshot.src}>
                    <img src={screenshot.src} alt={screenshot.title} loading="lazy" />
                    <figcaption>
                      <strong>{screenshot.title}</strong>
                      <span>{screenshot.caption}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {project.caseStudy?.nextSteps && (
            <section className="detail-block">
              <h2 className="section-heading">Next Steps</h2>
              <ul className="skills-list">
                {project.caseStudy.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="info-card project-side-card">
          <h2 className="section-heading">Project Snapshot</h2>
          <ul className="info-list compact-list">
            <li><span>Type:</span> {project.type}</li>
            <li><span>Status:</span> {project.status}</li>
            <li><span>Code:</span> {project.visibilityType === "private" ? "Private" : "Available / Demo"}</li>
          </ul>

          <h3 className="mini-heading">Tech Stack</h3>
          <div className="pill-list">
            {project.tech.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="source-box">
            <h3 className="mini-heading">Source Code Notice</h3>
            <p>{project.caseStudy?.sourceNotice}</p>
          </div>

          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noreferrer" className="btn btn-primary full-width">Open GitHub</a>
          )}
          {project.links?.demo && (
            <a href={project.links.demo} target="_blank" rel="noreferrer" className="btn btn-outline full-width external-btn">Watch Demo</a>
          )}
          {project.links?.linkedin && (
            <a href={project.links.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline full-width external-btn">LinkedIn Post</a>
          )}
        </aside>
      </div>
    </section>
  );
}

function SkillsPage({ data }) {
  return (
    <section className="page-section">
      <h1 className="page-title">Skills</h1>
      <p className="page-intro">
        A practical overview of the tools, technologies, and concepts I use across AI/ML, full-stack development, and embedded systems.
      </p>

      <div className="card-grid">
        {data.skills.map((skillGroup) => (
          <article className="card" key={skillGroup.category}>
            <h2>{skillGroup.category}</h2>
            <ul className="skills-list">
              {skillGroup.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="info-card education-card">
        <h2 className="section-heading">Education</h2>
        <p><strong>{data.education.degree}</strong></p>
        <p>{data.education.institution}</p>
        <p className="small-text">{data.education.timeline}</p>
        <p className="card-tech">Relevant Coursework: {data.education.coursework.join(", ")}</p>
      </div>
    </section>
  );
}

function NotFound({ navigate }) {
  return (
    <section className="page-section">
      <h1 className="page-title">Page Not Found</h1>
      <p className="page-intro">The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary" onClick={(event) => navigate(event, "/")}>Go Home</a>
    </section>
  );
}

export default App;
