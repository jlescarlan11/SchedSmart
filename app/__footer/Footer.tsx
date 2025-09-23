const Footer = () => {
  return (
    <footer className="wrapper mt-auto py-12">
      <div className="zen-divider" />
      <div className="zen-flex-center">
        <p className="zen-text-secondary text-sm tracking-wide">
          © {new Date().getFullYear()} John Lester Escarlan. Crafted with intention.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
