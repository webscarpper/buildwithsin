'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { createClient } from '@supabase/supabase-js';

const PhantomSignIn: FC = () => {
  const { publicKey, signMessage, wallet } = useWallet();

  const handleSignIn = async () => {
    console.log('🔥 PhantomSignIn clicked');
    
    if (!publicKey || !wallet) {
      console.error('🔥 Wallet not connected!');
      alert('Wallet not connected!');
      return;
    }

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      console.log('🔥 Attempting Supabase Web3 authentication with wallet:', wallet?.adapter?.name);
      
      // Use the official Supabase Web3 authentication method (casting to any due to TypeScript definitions)
      const { data, error } = await (supabase.auth as any).signInWithWeb3({
        chain: 'solana',
        statement: 'Welcome to GOATA. Please sign this message to log in.',
        wallet: wallet.adapter,
      });

      console.log('🔥 Supabase Web3 auth result:', { data, error });

      if (error) {
        console.error('🔥 Web3 authentication failed:', error);
        alert(`Authentication failed: ${error.message}`);
        return;
      }

      console.log('🔥 Solana authentication successful!');
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('🔥 signInWithSolana error:', error);
      alert('Authentication failed');
    }
  };

  return (
    <Button onClick={handleSignIn} className="w-full">
      Sign In with Phantom
    </Button>
  );
};

export default PhantomSignIn;