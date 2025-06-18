'use client';

import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useInitiateAgentMutation } from '@/hooks/react-query/dashboard/use-initiate-agent';
import { isLocalMode } from '@/lib/config';
import { BillingError } from '@/lib/api';

const PENDING_PROMPT_KEY = 'pendingAgentPrompt';

export function UseCasesSection() {
  const { useCases } = siteConfig;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();
  const initiateAgentMutation = useInitiateAgentMutation();

  const createAgentWithPrompt = async (prompt: string) => {
    if (!prompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      formData.append('model_name', 'openrouter/deepseek/deepseek-chat');
      formData.append('enable_thinking', 'false');
      formData.append('reasoning_effort', 'low');
      formData.append('stream', 'true');
      formData.append('enable_context_manager', 'false');

      const result = await initiateAgentMutation.mutateAsync(formData);

      window.location.href = `/thread/${result.thread_id}`;
    } catch (error: any) {
      if (error instanceof BillingError) {
        console.log('Billing error:');
      } else {
        const isConnectionError =
          error instanceof TypeError &&
          error.message.includes('Failed to fetch');
        if (!isLocalMode() || isConnectionError) {
          console.error(
            error.message || 'Failed to create agent. Please try again.',
          );
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (prompt: string) => {
    if (!prompt.trim() || isSubmitting) return;

    if (!user && !isLoading) {
      localStorage.setItem(PENDING_PROMPT_KEY, prompt.trim());
      window.location.href = '/auth';
      return;
    }

    createAgentWithPrompt(prompt);
  };

  return (
    <section
      id="use-cases"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          See <span className="goata-logo-text" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8em', verticalAlign: 'middle' }}>GOATA</span> in action
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Explore real-world examples of how GOATA completes complex tasks
          autonomously
        </p>
      </SectionHeader>

      <div className="relative w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 w-full max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <button key={index} className="usecase-card has-tilt text-left" onClick={() => handleCardClick(useCase.description)}>
              <div className="w-6 h-6 mb-2 text-cyan-400">
                {index === 0 && <ArrowRight />}
                {index === 1 && <ArrowRight />}
                {index === 2 && <ArrowRight />}
                {index === 3 && <ArrowRight />}
                {index === 4 && <ArrowRight />}
                {index === 5 && <ArrowRight />}
                {index === 6 && <ArrowRight />}
                {index === 7 && <ArrowRight />}
              </div>
              <h3 className="text-lg font-medium line-clamp-1">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </button>
          ))}
        </div>

        {useCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No use cases available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
