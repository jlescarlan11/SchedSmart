"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/components/ui/logo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigationToggle from "./MobileNavigationToggle";
import MobileNavigation from "./MobileNavigation";
import { usePathname } from "next/navigation";

const NavigationBar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // Simplified active page detection
  const activePage = pathname === "/" ? "" : pathname.slice(1);

  // Handle mobile menu effects
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };

    const handleResize = (): void => {
      if (window.innerWidth >= 1024) setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="fixed w-full top-0 left-0 z-50 bg-background">
      <nav className="wrapper h-28 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <DesktopNavigation setOpen={setOpen} activePage={activePage} />
          <MobileNavigationToggle open={open} setOpen={setOpen} />
        </div>
      </nav>
      <MobileNavigation open={open} setOpen={setOpen} activePage={activePage} />
    </div>
  );
};

export default NavigationBar;
