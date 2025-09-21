"use client";

import pages from "@/data/navigationPage";
import { cn } from "@/lib/utils";
import { NavigationLinksProps } from "@/types/navigationProps";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const NavigationLinks: React.FC<NavigationLinksProps> = ({
  closeNav,
  className,
}) => {
  const pathname = usePathname();

  // Simplified active page detection
  const getActivePage = () => {
    if (pathname === "/") return "";
    return pathname.slice(1); // Remove leading slash
  };

  const activePage = getActivePage();

  return (
    <nav
      className={cn(
        "flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8",
        className
      )}
    >
      {pages.map(([path, label]) => {
        const href = path === "" ? "/" : `/${path}`;
        const isActive = activePage === path;

        return (
          <Link
            key={path}
            href={href}
            onClick={closeNav}
            className="group relative flex flex-col items-start lg:items-center gap-1"
            aria-label={`Navigate to ${label} page`}
          >
            <span
              className={cn(
                "text-lg font-semibold lg:text-sm transition-colors duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </span>
            <div
              className={cn(
                "absolute -bottom-1 left-0 lg:left-1/2 lg:-translate-x-1/2 h-px bg-primary transition-all duration-300",
                isActive ? "w-6" : "w-0 group-hover:w-6"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationLinks;
