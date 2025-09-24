"use client";

import Logo from "@/components/ui/logo";
import pages from "@/data/navigationPage";
import { cn } from "@/lib/utils";
import { getHrefFromPath, isPageActive } from "@/utils/navigation";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden z-50 relative"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[80vw]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Navigate through SmartSched features
                </SheetDescription>
              </SheetHeader>
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
              <div className="p-6 border-t border-border/10">
                <p className="text-xs zen-text-secondary text-center">
                  SmartSched - Intelligent Scheduling
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

    </>
  );
};

export default NavigationBar;
