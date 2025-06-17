'use client';

import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function UseCasesSection() {
  const { useCases } = siteConfig;

  return (
    <section
      id="use-cases"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          See GOATA in action
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Explore real-world examples of how GOATA completes complex tasks
          autonomously
        </p>
      </SectionHeader>

      <div className="relative w-full h-full">
        <div className="grid min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-4 w-full max-w-6xl mx-auto px-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden relative h-fit min-[650px]:h-full flex flex-col md:shadow-[0px_61px_24px_-10px_rgba(0,0,0,0.01),0px_34px_20px_-8px_rgba(0,0,0,0.05),0px_15px_15px_-6px_rgba(0,0,0,0.09),0px_4px_8px_-2px_rgba(0,0,0,0.10),0px_0px_0px_1px_rgba(0,0,0,0.08)] bg-accent p-4"
            >
              <h3 className="text-lg font-medium line-clamp-1">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {useCase.description}
              </p>
            </div>
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
