export const smoothScrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 128; // Account for fixed header height
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  } else {
    // Retry after a short delay if element doesn't exist yet
    setTimeout(() => {
      const retryElement = document.getElementById(sectionId);
      if (retryElement) {
        const offsetTop = retryElement.offsetTop - 128;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }, 100);
  }
};
