/**
 * Navigation utilities to avoid code duplication
 */

/**
 * Get active page from pathname
 * @param pathname - Current pathname from usePathname()
 * @returns Active page string ("" for home, "about", "guide", etc.)
 */
export function getActivePageFromPathname(pathname: string): string {
  if (pathname === "/") return "";
  return pathname.slice(1); // Remove leading slash
}

/**
 * Check if a page is currently active
 * @param pathname - Current pathname
 * @param targetPath - Path to check against ("", "about", "guide", etc.)
 * @returns Boolean indicating if page is active
 */
export function isPageActive(pathname: string, targetPath: string): boolean {
  const activePage = getActivePageFromPathname(pathname);
  return activePage === targetPath;
}

/**
 * Get href from page path
 * @param path - Page path ("", "about", "guide", etc.)
 * @returns Full href string
 */
export function getHrefFromPath(path: string): string {
  return path === "" ? "/" : `/${path}`;
}
