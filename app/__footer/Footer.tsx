import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="wrapper mt-auto py-12">
      <Separator className="mb-8" />
      <div className="zen-flex-center">
        <p className="zen-text-secondary text-sm tracking-wide">
          © {new Date().getFullYear()} John Lester Escarlan. Crafted with intention.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
