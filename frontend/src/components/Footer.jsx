function Footer({ profile }) {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
