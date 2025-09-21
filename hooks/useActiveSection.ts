import { useEffect, useState } from "react";

export const useActiveSection = (sections: string[]): string => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + 200; // Offset for better UX
      let foundActiveSection = "";

      // Find the current section (iterate backwards to get the topmost visible section)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop - 128;
          if (scrollPosition >= sectionTop) {
            foundActiveSection = sections[i];
            break;
          }
        }
      }

      setActiveSection(foundActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return activeSection;
};
