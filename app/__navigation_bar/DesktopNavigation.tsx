import React from "react";
import NavigationLinks from "./NavigationLinks";

interface DesktopNavigationProps {
  setOpen: (open: boolean) => void;
  activePage: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  setOpen,
  activePage,
}) => {
  return (
    <div className="hidden lg:block">
      <NavigationLinks
        closeNav={() => setOpen(false)}
        activePage={activePage}
      />
    </div>
  );
};

export default DesktopNavigation;
