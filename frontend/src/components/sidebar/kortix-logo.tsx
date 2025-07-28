'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface BuildWithSinLogoProps {
  size?: number;
}
export function BuildWithSinLogo({ size = 32 }: BuildWithSinLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Image
        src="/buildwithsin-symbol.png"
        alt="BuildWithSin"
        width={size}
        height={size}
        className={`flex-shrink-0`}
      />
  );
}

// Legacy export for backward compatibility
export const KortixLogo = BuildWithSinLogo;
