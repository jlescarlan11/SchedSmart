import React from "react";
import NavigationLinks from "./NavigationLinks";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activePage: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  open,
  setOpen,
  activePage,
}) => {
  return (
    <div
      className={cn(
        "lg:hidden fixed inset-0 top-28 bg-background border-t z-40 transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <nav className="flex flex-col p-8">
        <NavigationLinks
          closeNav={() => setOpen(false)}
          activePage={activePage}
          className="items-start"
        />
      </nav>
    </div>
  );
};

export default MobileNavigation;
