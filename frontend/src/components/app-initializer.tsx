'use client';

import { useState, useEffect } from 'react';
import AnimationTest from '@/components/home/animation-test';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnimationTest />;
  }

  return <>{children}</>;
}
