// components/MobileNavigationToggle.tsx
import { NavigationProps } from "@/types/navigationProps";
import React from "react";
import { MdMenu, MdMenuOpen } from "react-icons/md";

const MobileNavigationToggle: React.FC<NavigationProps> = ({
  open,
  setOpen,
}) => {
  const Icon = open ? MdMenuOpen : MdMenu;

  return (
    <button
      onClick={() => setOpen(!open)}
      className="lg:hidden z-50 p-2 -m-2 rounded-md hover:bg-accent transition-colors"
      aria-label={`${open ? "Close" : "Open"} menu`}
      type="button"
    >
      <Icon size={28} />
    </button>
  );
};

export default MobileNavigationToggle;
