"use client";

import Logo from "@/components/ui/logo";
import pages from "@/data/navigationPage";
import { cn } from "@/lib/utils";
import { getHrefFromPath, isPageActive } from "@/utils/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  return (
    <>
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/10">
        <nav className="wrapper h-28 flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {pages.map(([path, label]) => {
              const href = getHrefFromPath(path);
              const isActive = isPageActive(pathname, path);

              return (
                <Link
                  key={path}
                  href={href}
                  className="group relative flex flex-col items-center gap-1"
                >
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </span>
                  <div
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-300",
                      isActive ? "w-6" : "w-0 group-hover:w-6"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden z-50 relative p-2 rounded-xl hover:bg-accent/20 transition-colors zen-focus-ring"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Invisible click area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3,
              }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[80vw] bg-background border-l border-border/20 zen-shadow-medium"
            >
              <div className="flex flex-col h-full">
                {/* Header with Close Button */}
                <div className="h-28 flex items-center justify-end px-6 border-b border-border/10">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-accent/20 transition-colors zen-focus-ring"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {pages.map(([path, label], index) => {
                      const href = getHrefFromPath(path);
                      const isActive = isPageActive(pathname, path);

                      return (
                        <motion.div
                          key={path}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1 + 0.2,
                            duration: 0.4,
                          }}
                        >
                          <Link
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-4 py-3 rounded-xl transition-all duration-200 group",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium tracking-wide">
                                {label}
                              </span>
                              {isActive && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-border/10">
                  <p className="text-xs zen-text-secondary text-center">
                    SmartSched - Intelligent Scheduling
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
