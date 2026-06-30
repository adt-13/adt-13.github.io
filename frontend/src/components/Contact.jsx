import { useState } from "react";

function Contact({ profile, apiUrl, apiStatus }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Contact endpoint failed");
      setStatus("Message received by the demo API. Connect email service later for real delivery.");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("Demo form only. Please contact me directly by email for now.");
    }
  };

  return (
    <section className="page-section">
      <h1 className="page-title">Contact</h1>
      <p className="page-intro">
        Feel free to reach out for collaboration, internship opportunities, project discussion, or research-related conversation.
      </p>

      <div className="two-column">
        <div className="content-block">
          <h2 className="section-heading">Contact Details</h2>
          <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <p>Phone: <a href={`tel:${profile.phone}`}>{profile.phone}</a></p>
          <p>GitHub: <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>
          <p>LinkedIn: <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></p>
          <p className="small-text">API status: {apiStatus === "connected" ? "FastAPI connected" : "Using frontend fallback data"}</p>
        </div>

        <form id="contact-form" className="form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required placeholder="Your name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="Your email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required placeholder="Write your message..." value={formData.message} onChange={handleChange}></textarea>
          </div>

          <button type="submit" className="btn btn-primary full-width">Send Message</button>
          {status && <p className="small-text form-status">{status}</p>}
          <p className="small-text">* This is a demo form. Real email delivery can be connected later.</p>
        </form>
      </div>
    </section>
  );
}

export default Contact;
