// Environment mode types
export enum EnvMode {
  LOCAL = 'local',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

// Subscription tier structure
export interface SubscriptionTierData {
  priceId: string;
  name: string;
}

// Subscription tiers structure
export interface SubscriptionTiers {
  FREE: SubscriptionTierData;
  TIER_2_20: SubscriptionTierData;
  TIER_6_50: SubscriptionTierData;
  TIER_12_100: SubscriptionTierData;
  TIER_25_200: SubscriptionTierData;
  TIER_50_400: SubscriptionTierData;
  TIER_125_800: SubscriptionTierData;
  TIER_200_1000: SubscriptionTierData;
}

// Configuration object
interface Config {
  ENV_MODE: EnvMode;
  IS_LOCAL: boolean;
  SUBSCRIPTION_TIERS: SubscriptionTiers;
}

// Production tier IDs - Updated with your new Stripe Price IDs
const PROD_TIERS: SubscriptionTiers = {
  FREE: {
    priceId: 'price_1RdYzWFGcO2Bsf6G6DtXgpfH',
    name: 'Free',
  },
  TIER_2_20: {
    priceId: 'price_1RdZ7BFGcO2Bsf6GipUIRpPI',
    name: '2h/$20',
  },
  TIER_6_50: {
    priceId: 'price_1RdZPYFGcO2Bsf6GNUQZO9OT',
    name: '6h/$50',
  },
  TIER_12_100: {
    priceId: 'price_1RdZSwFGcO2Bsf6GrRlDScqw',
    name: '12h/$100',
  },
  TIER_25_200: {
    priceId: 'price_1RdZV5FGcO2Bsf6GFQDvYsGh',
    name: '25h/$200',
  },
  TIER_50_400: {
    priceId: 'price_1RdZXiFGcO2Bsf6GLW66UwBi',
    name: '50h/$400',
  },
  TIER_125_800: {
    priceId: 'price_1RdZaaFGcO2Bsf6GwvcRpLFb',
    name: '125h/$800',
  },
  TIER_200_1000: {
    priceId: 'price_1RdZcbFGcO2Bsf6GqMoQ8YLQ',
    name: '200h/$1000',
  },
} as const;

// Staging tier IDs - Updated to use your GOATA Stripe Price IDs (same as production)
const STAGING_TIERS: SubscriptionTiers = {
  FREE: {
    priceId: 'price_1RdYzWFGcO2Bsf6G6DtXgpfH',
    name: 'Free',
  },
  TIER_2_20: {
    priceId: 'price_1RdZ7BFGcO2Bsf6GipUIRpPI',
    name: '2h/$20',
  },
  TIER_6_50: {
    priceId: 'price_1RdZPYFGcO2Bsf6GNUQZO9OT',
    name: '6h/$50',
  },
  TIER_12_100: {
    priceId: 'price_1RdZSwFGcO2Bsf6GrRlDScqw',
    name: '12h/$100',
  },
  TIER_25_200: {
    priceId: 'price_1RdZV5FGcO2Bsf6GFQDvYsGh',
    name: '25h/$200',
  },
  TIER_50_400: {
    priceId: 'price_1RdZXiFGcO2Bsf6GLW66UwBi',
    name: '50h/$400',
  },
  TIER_125_800: {
    priceId: 'price_1RdZaaFGcO2Bsf6GwvcRpLFb',
    name: '125h/$800',
  },
  TIER_200_1000: {
    priceId: 'price_1RdZcbFGcO2Bsf6GqMoQ8YLQ',
    name: '200h/$1000',
  },
} as const;

// Determine the environment mode from environment variables
const getEnvironmentMode = (): EnvMode => {
  // Get the environment mode from the environment variable, if set
  const envMode = process.env.NEXT_PUBLIC_ENV_MODE?.toLowerCase();

  // First check if the environment variable is explicitly set
  if (envMode) {
    if (envMode === EnvMode.LOCAL) {
      console.log('Using explicitly set LOCAL environment mode');
      return EnvMode.LOCAL;
    } else if (envMode === EnvMode.STAGING) {
      console.log('Using explicitly set STAGING environment mode');
      return EnvMode.STAGING;
    } else if (envMode === EnvMode.PRODUCTION) {
      console.log('Using explicitly set PRODUCTION environment mode');
      return EnvMode.PRODUCTION;
    }
  }

  // If no valid environment mode is set, fall back to PRODUCTION
  console.log('Defaulting to PRODUCTION environment mode');
  return EnvMode.PRODUCTION;
};

// Get the environment mode once to ensure consistency
const currentEnvMode = getEnvironmentMode();

// Create the config object
export const config: Config = {
  ENV_MODE: currentEnvMode,
  IS_LOCAL: currentEnvMode === EnvMode.LOCAL,
  SUBSCRIPTION_TIERS:
    currentEnvMode === EnvMode.STAGING ? STAGING_TIERS : PROD_TIERS,
};

// Helper function to check if we're in local mode (for component conditionals)
export const isLocalMode = (): boolean => {
  return config.IS_LOCAL;
};

// Export subscription tier type for typing elsewhere
export type SubscriptionTier = keyof typeof PROD_TIERS;
