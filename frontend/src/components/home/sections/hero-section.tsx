'use client';

import React from 'react';
import { Zap, Users, MessageSquare } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="w-full"
    >
      <div
        className="container mx-auto max-w-[1200px] text-center"
        style={{
          padding: '120px 24px 80px',
        }}
      >
        <h1
          className="text-4xl md:text-7xl font-bold tracking-tighter"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            color: '#1D1D1F',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Think. Build. Ship.
        </h1>
        <p
          className="text-xl md:text-2xl max-w-xl mx-auto"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            color: '#86868B',
            lineHeight: 1.4,
            marginBottom: '48px',
          }}
        >
          The AI that understands what you're building
        </p>
        <button
          className="text-white text-lg font-semibold rounded-xl"
          style={{
            backgroundColor: '#007AFF',
            padding: '16px 32px',
            border: 'none',
            boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056CC';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 122, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007AFF';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 122, 255, 0.3)';
          }}
        >
          Start Building
        </button>
        <div
          className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 mt-20 flex-wrap"
        >
          {[
            {
              icon: <Zap size={24} color="#007AFF" />,
              text: '5000+ MCP Integrations',
              delay: '0.6s',
            },
            {
              icon: <Users size={24} color="#007AFF" />,
              text: 'Free Agent Marketplace',
              delay: '0.8s',
            },
            {
              icon: <MessageSquare size={24} color="#007AFF" />,
              text: 'Natural Language Builder',
              delay: '1.0s',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
              style={{
                animation: `fadeInFromBottom 0.6s ease-out forwards`,
                animationDelay: stat.delay,
                opacity: 0,
              }}
            >
              {stat.icon}
              <span
                className="text-sm md:text-base font-semibold"
                style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  color: '#1D1D1F',
                }}
              >
                {stat.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
