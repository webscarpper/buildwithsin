import Image from 'next/image';
import { siteConfig } from '@/lib/home';
import Link from 'next/link';

export function CTASection() {
  const { ctaSection } = siteConfig;

  return (
    <section
      id="cta"
      className="flex flex-col items-center justify-center w-full pt-12 pb-12"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="cta-panel h-[400px] md:h-[400px] overflow-hidden w-full relative z-20 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-7xl font-medium tracking-tighter max-w-xs md:max-w-xl text-center">
            Unlock <span className="buildwithsin-logo-text" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8em' }}>Alpha</span>. Deploy Smarter.
          </h1>
          <div className="absolute bottom-10 flex flex-col items-center justify-center gap-2">
            <Link
              href={ctaSection.button.href}
              className="cta-button text-white font-semibold text-sm h-10 w-fit px-4 rounded-full flex items-center justify-center"
            >
              {ctaSection.button.text}
            </Link>
            <span className="text-white text-sm">
              Powered by Autonomous AI Agents trained on Web3 primitives.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
