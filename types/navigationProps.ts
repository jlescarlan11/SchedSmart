// types/navigationProps.ts
export interface NavigationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface NavigationLinksProps {
  closeNav: () => void;
  activePage: string; // Represents the currently active page
  className?: string;
}
