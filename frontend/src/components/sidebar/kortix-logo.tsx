'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface GoataLogoProps {
  size?: number;
}
export function GoataLogo({ size = 32 }: GoataLogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mount, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Image
        src="/goata-symbol.png"
        alt="GOATA"
        width={size}
        height={size}
        className={`flex-shrink-0`}
      />
  );
}

// Legacy export for backward compatibility
export const KortixLogo = GoataLogo;
