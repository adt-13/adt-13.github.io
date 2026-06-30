function Navbar({ profile, path, navigate }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" }
  ];

  const isActive = (href) => {
    if (href === "/") return path === "/";
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <nav className="site-nav">
      <div className="nav-container">
        <a href="/" className="nav-brand" onClick={(event) => navigate(event, "/")}>
          {profile.name.split(" ")[0]}<span>.</span>
        </a>

        <div className="nav-links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : ""}
              onClick={(event) => navigate(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
