const Footer = () => {
  return (
    <footer
      className={`wrapper section-spacing h-28 flex items-center flex-col sm:flex-row justify-center sm:justify-between mt-auto`}
    >
      <p className="text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} John Lester Escarlan. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
