import { useState, useEffect } from "react";

/**
 * Custom hook to safely handle client-side only logic without hydration mismatches
 * Returns true only after the component has mounted on the client side
 */
export const useHydrationSafe = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
