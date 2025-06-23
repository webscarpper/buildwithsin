'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFeatureFlag } from '@/lib/feature-flags';
import { Loader2 } from 'lucide-react';

export default function NewAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { enabled: agentPlaygroundEnabled, loading } = useFeatureFlag('custom_agents');

  useEffect(() => {
    if (!loading && !agentPlaygroundEnabled) {
      router.replace('/dashboard');
    }
  }, [agentPlaygroundEnabled, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!agentPlaygroundEnabled) {
    return null;
  }

  return <>{children}</>;
}
