'use client';

import { useState } from 'react';
import AnimationTest from '@/components/home/animation-test';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const handleAnimationComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <AnimationTest onAnimationComplete={handleAnimationComplete} />;
  }

  return <>{children}</>;
}
