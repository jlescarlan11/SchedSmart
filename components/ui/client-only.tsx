"use client";

import { useHydrationSafe } from "@/hooks/useHydrationSafe";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that only renders its children on the client side
 * Useful for preventing hydration mismatches with client-side only logic
 */
export const ClientOnly: React.FC<ClientOnlyProps> = ({ 
  children, 
  fallback = null 
}) => {
  const isClient = useHydrationSafe();
  
  if (!isClient) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
