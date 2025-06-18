'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/home/section-header';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqData = [
  {
    question: 'What is GOATA and how does it help Web3 developers?',
    answer:
      'GOATA (Greatest Of All Time Assistant) is an autonomous AI agent that can help you build, deploy, and manage Web3 applications. From smart contract development to DApp frontend creation, GOATA handles complex development tasks through natural conversation.',
  },
  {
    question: 'Can GOATA help me build smart contracts?',
    answer:
      'Yes! GOATA can write, review, and deploy smart contracts in Solidity, Rust (for Solana), or other blockchain languages. It can also audit your contracts for common vulnerabilities and suggest optimizations for gas efficiency.',
  },
  {
    question: 'How can GOATA assist with DApp development?',
    answer:
      'GOATA can create complete DApp frontends using React, Next.js, or Vue.js with Web3 integrations. It handles wallet connections, contract interactions, and can even implement complex DeFi protocols or NFT marketplaces.',
  },
  {
    question: 'Can GOATA deploy my Web3 applications?',
    answer:
      'Absolutely! GOATA can deploy your smart contracts to testnets and mainnets, set up IPFS hosting for decentralized frontends, and configure deployment pipelines. It supports Ethereum, Polygon, Solana, Base, and other major chains.',
  },
  {
    question: 'Does GOATA understand Web3 protocols and standards?',
    answer:
      'Yes, GOATA is trained on Web3 standards including ERC-20, ERC-721, ERC-1155, and emerging protocols. It can implement token standards, create DAOs, build DeFi protocols, and integrate with existing Web3 infrastructure.',
  },
  {
    question: 'How can GOATA help with tokenomics and DAO creation?',
    answer:
      'GOATA can design tokenomics models, create governance tokens, set up DAO structures with Aragon or Snapshot, and implement voting mechanisms. It understands economic models and can suggest optimal token distribution strategies.',
  },
  {
    question: 'Can GOATA integrate with Web3 tools and services?',
    answer:
      'Yes! GOATA works with popular Web3 tools like Hardhat, Truffle, Foundry, The Graph, Moralis, Alchemy, and Infura. It can set up development environments and configure these tools for your specific needs.',
  },
  {
    question: 'How does GOATA handle Web3 security best practices?',
    answer:
      'GOATA implements security-first development, including reentrancy protection, access controls, and proper randomness handling. It can perform security audits and suggest improvements based on industry best practices.',
  },
  {
    question: 'Can GOATA help with NFT projects and marketplaces?',
    answer:
      'Definitely! GOATA can create NFT collections, implement minting mechanisms, build custom marketplaces, and handle metadata management. It supports both ERC-721 and ERC-1155 standards with advanced features.',
  },
  {
    question: 'Does GOATA support cross-chain development?',
    answer:
      'Yes, GOATA can build cross-chain applications using bridges, implement multi-chain strategies, and deploy to multiple networks simultaneously. It understands the nuances of different blockchain ecosystems.',
  },
  {
    question: 'How can GOATA assist with DeFi protocol development?',
    answer:
      'GOATA can build lending protocols, DEXs, yield farming platforms, and other DeFi primitives. It understands liquidity mechanics, AMM algorithms, and can implement complex financial instruments.',
  },
  {
    question: 'Can GOATA help with Web3 testing and debugging?',
    answer:
      'Absolutely! GOATA can write comprehensive test suites, set up local blockchain environments, perform gas optimization, and debug complex transaction failures. It supports both unit and integration testing.',
  },
  {
    question: 'How does GOATA stay updated with Web3 trends?',
    answer:
      'GOATA continuously learns from the latest Web3 developments, protocol updates, and emerging standards. It can research new protocols and implement cutting-edge features in your projects.',
  },
  {
    question: 'Can GOATA help with Web3 documentation and tutorials?',
    answer:
      'Yes! GOATA can create technical documentation, write tutorials, generate API docs, and create educational content for your Web3 projects. It understands both technical and non-technical audiences.',
  },
];

export function FAQSection() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleAll = () => {
    if (openIndices.length === faqData.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(faqData.map((_, i) => i));
    }
  };

  return (
    <section id="faq" className="flex flex-col items-center justify-center gap-10 pb-20 w-full relative">
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          Ask GOATA
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Your On-Ramp to Web3 Domination
        </p>
      </SectionHeader>

      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="text-right mb-4">
          <button onClick={toggleAll} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            {openIndices.length === faqData.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-card">
              <button
                className="w-full text-left flex justify-between items-center p-4"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn('w-5 h-5 transition-transform', {
                    'transform rotate-180': openIndices.includes(index),
                  })}
                />
              </button>
              {openIndices.includes(index) && (
                <div className="p-4 pt-0">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
