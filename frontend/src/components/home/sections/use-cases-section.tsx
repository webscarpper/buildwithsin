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

  const useCasesWithLinks = useCases.map((useCase) => {
    switch (useCase.title) {
      case 'DeFi Yield Farming':
        return { ...useCase, href: 'https://buildwithsin.com/share/f6006983-8b05-42d1-8b5b-e1cdfa71faae' };
      case 'RWA Tokenization...':
        return { ...useCase, href: 'https://buildwithsin.com/share/7ba9d31b-7862-42a4-ace1-7f0c2adcdc56' };
      case 'GameFi & Metaverse...':
        return { ...useCase, href: 'https://buildwithsin.com/share/f82a7ce4-f8df-45be-8397-04cd155f8b83' };
      case 'DAO Governance...':
        return { ...useCase, href: 'https://buildwithsin.com/share/e1dcc901-24cd-4511-91b6-b77922e7049b' };
      case 'Automated Smart...':
        return { ...useCase, href: 'https://buildwithsin.com/share/5ae43af3-4c08-4d27-94ed-73e3bbe266d9' };
      case 'Web3 Market Intel':
        return { ...useCase, href: 'https://buildwithsin.com/share/f49fc3a2-8e32-45ed-8599-03122bea2f6a' };
      case 'Cross-Chain Arbitrage':
        return { ...useCase, href: 'https://buildwithsin.com/share/0e5b4e7b-fea5-4797-8a89-b832b4752a54' };
      case 'DeFi Portfolio...':
        return { ...useCase, href: 'https://buildwithsin.com/share/b892fcb2-dc77-43df-8566-41492dc9aa53' };
      default:
        return { ...useCase, href: '#' };
    }
  });

  return (
    <section
      id="use-cases"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          See <span className="buildwithsin-logo-text" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8em', verticalAlign: 'middle' }}>BuildWithSin</span> in action
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Explore real-world examples of how BuildWithSin completes complex tasks
          autonomously
        </p>
      </SectionHeader>

      <div className="relative w-full h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 w-full max-w-6xl mx-auto">
          {useCasesWithLinks.map((useCase, index) => (
            <a key={index} href={useCase.href} target="_blank" rel="noopener noreferrer" className="usecase-card text-left">
              <div className="w-6 h-6 mb-2 text-cyan-400">
                <ArrowRight />
              </div>
              <h3 className="text-lg font-medium line-clamp-1">
                {useCase.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </a>
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
