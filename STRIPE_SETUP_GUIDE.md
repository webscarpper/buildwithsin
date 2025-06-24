# Complete Stripe Setup Guide for GOATA

This guide will help you replicate the exact current billing structure with your own Stripe credentials.

## 1. Understanding the Current Tier Structure

Your GOATA application currently has **8 subscription tiers** with the following structure:

| Tier Name | Hours/Month | Price/Month | Minutes Limit | Target Users |
|-----------|-------------|-------------|---------------|--------------|
| FREE | 0.5h | $0 | 30 minutes | Basic users |
| TIER_2_20 | 2h | $20 | 120 minutes | Light users |
| TIER_6_50 | 6h | $50 | 360 minutes | Regular users |
| TIER_12_100 | 12h | $100 | 720 minutes | Heavy users |
| TIER_25_200 | 25h | $200 | 1500 minutes | Professional users |
| TIER_50_400 | 50h | $400 | 3000 minutes | Team users |
| TIER_125_800 | 125h | $800 | 7500 minutes | Enterprise users |
| TIER_200_1000 | 200h | $1000 | 12000 minutes | Enterprise+ users |

## 2. Stripe Dashboard Setup

### Step 1: Create Stripe Products
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. Create 8 products with these exact names:

```
1. "GOATA Free Plan" (for FREE tier)
2. "GOATA Starter Plan - 2 Hours" (for TIER_2_20)
3. "GOATA Basic Plan - 6 Hours" (for TIER_6_50)
4. "GOATA Professional Plan - 12 Hours" (for TIER_12_100)
5. "GOATA Advanced Plan - 25 Hours" (for TIER_25_200)
6. "GOATA Premium Plan - 50 Hours" (for TIER_50_400)
7. "GOATA Enterprise Plan - 125 Hours" (for TIER_125_800)
8. "GOATA Enterprise+ Plan - 200 Hours" (for TIER_200_1000)
```

### Step 2: Create Pricing for Each Product
For each product, create a **recurring price** with these configurations:

**FREE Tier:**
- Price: $0.00 USD
- Billing period: Monthly
- Usage type: Licensed (not metered)

**TIER_2_20:**
- Price: $20.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_6_50:**
- Price: $50.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_12_100:**
- Price: $100.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_25_200:**
- Price: $200.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_50_400:**
- Price: $400.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_125_800:**
- Price: $800.00 USD
- Billing period: Monthly
- Usage type: Licensed

**TIER_200_1000:**
- Price: $1000.00 USD
- Billing period: Monthly
- Usage type: Licensed

## 3. Current Code Structure Analysis

### Frontend Configuration (frontend/src/lib/config.ts)
The frontend contains both **STAGING** and **PRODUCTION** price IDs:

**Current Production Price IDs:**
```typescript
const PROD_TIERS: SubscriptionTiers = {
  FREE: { priceId: 'price_1RILb4G6l1KZGqIrK4QLrx9i', name: 'Free' },
  TIER_2_20: { priceId: 'price_1RILb4G6l1KZGqIrhomjgDnO', name: '2h/$20' },
  TIER_6_50: { priceId: 'price_1RILb4G6l1KZGqIr5q0sybWn', name: '6h/$50' },
  TIER_12_100: { priceId: 'price_1RILb4G6l1KZGqIr5Y20ZLHm', name: '12h/$100' },
  TIER_25_200: { priceId: 'price_1RILb4G6l1KZGqIrGAD8rNjb', name: '25h/$200' },
  TIER_50_400: { priceId: 'price_1RILb4G6l1KZGqIruNBUMTF1', name: '50h/$400' },
  TIER_125_800: { priceId: 'price_1RILb3G6l1KZGqIrbJA766tN', name: '125h/$800' },
  TIER_200_1000: { priceId: 'price_1RILb3G6l1KZGqIrmauYPOiN', name: '200h/$1000' },
}
```

### Backend Billing Logic (backend/services/billing.py)
The backend contains the complete billing system with:
- Stripe customer management
- Subscription management
- Usage tracking and limits
- Manual subscription fallback
- Model access control

### Model Access Control (backend/utils/constants.py)
Each tier has specific model access permissions:

**FREE tier models:**
- openrouter/deepseek/deepseek-chat
- openrouter/qwen/qwen3-235b-a22b  
- openrouter/google/gemini-2.5-flash-preview-05-20

**Paid tier models (all tiers 2-8):**
- All FREE models plus:
- openai/gpt-4o
- anthropic/claude-3-7-sonnet-latest
- anthropic/claude-sonnet-4-20250514

## 4. Configuration Update Process

### Step 1: Update Frontend Configuration
Replace the price IDs in `frontend/src/lib/config.ts`:

```typescript
// Replace PROD_TIERS with your new Price IDs
const PROD_TIERS: SubscriptionTiers = {
  FREE: {
    priceId: 'price_YOUR_FREE_PRICE_ID_HERE',
    name: 'Free',
  },
  TIER_2_20: {
    priceId: 'price_YOUR_TIER_2_20_PRICE_ID_HERE',
    name: '2h/$20',
  },
  TIER_6_50: {
    priceId: 'price_YOUR_TIER_6_50_PRICE_ID_HERE',
    name: '6h/$50',
  },
  TIER_12_100: {
    priceId: 'price_YOUR_TIER_12_100_PRICE_ID_HERE',
    name: '12h/$100',
  },
  TIER_25_200: {
    priceId: 'price_YOUR_TIER_25_200_PRICE_ID_HERE',
    name: '25h/$200',
  },
  TIER_50_400: {
    priceId: 'price_YOUR_TIER_50_400_PRICE_ID_HERE',
    name: '50h/$400',
  },
  TIER_125_800: {
    priceId: 'price_YOUR_TIER_125_800_PRICE_ID_HERE',
    name: '125h/$800',
  },
  TIER_200_1000: {
    priceId: 'price_YOUR_TIER_200_1000_PRICE_ID_HERE',
    name: '200h/$1000',
  },
} as const;
```

### Step 2: Update Backend Configuration
Update `backend/utils/config.py` with your Stripe credentials:

```python
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY = "pk_live_YOUR_PUBLISHABLE_KEY_HERE"  # or pk_test_ for test mode
STRIPE_SECRET_KEY = "sk_live_YOUR_SECRET_KEY_HERE"  # or sk_test_ for test mode
STRIPE_WEBHOOK_SECRET = "whsec_YOUR_WEBHOOK_SECRET_HERE"

# Update SUBSCRIPTION_TIERS with your Price IDs
SUBSCRIPTION_TIERS = {
    "FREE": {
        "price_id": "price_YOUR_FREE_PRICE_ID_HERE",
        "name": "Free",
        "minutes_limit": 30,
        "models": ["openrouter/deepseek/deepseek-chat", "openrouter/qwen/qwen3-235b-a22b", "openrouter/google/gemini-2.5-flash-preview-05-20"]
    },
    "TIER_2_20": {
        "price_id": "price_YOUR_TIER_2_20_PRICE_ID_HERE", 
        "name": "2h/$20",
        "minutes_limit": 120,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_6_50": {
        "price_id": "price_YOUR_TIER_6_50_PRICE_ID_HERE",
        "name": "6h/$50", 
        "minutes_limit": 360,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_12_100": {
        "price_id": "price_YOUR_TIER_12_100_PRICE_ID_HERE",
        "name": "12h/$100",
        "minutes_limit": 720,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_25_200": {
        "price_id": "price_YOUR_TIER_25_200_PRICE_ID_HERE",
        "name": "25h/$200",
        "minutes_limit": 1500,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_50_400": {
        "price_id": "price_YOUR_TIER_50_400_PRICE_ID_HERE",
        "name": "50h/$400",
        "minutes_limit": 3000,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_125_800": {
        "price_id": "price_YOUR_TIER_125_800_PRICE_ID_HERE",
        "name": "125h/$800",
        "minutes_limit": 7500,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    },
    "TIER_200_1000": {
        "price_id": "price_YOUR_TIER_200_1000_PRICE_ID_HERE",
        "name": "200h/$1000",
        "minutes_limit": 12000,
        "models": ["openrouter/deepseek/deepseek-chat", "openai/gpt-4o", "openrouter/google/gemini-2.5-flash-preview-05-20", "anthropic/claude-3-7-sonnet-latest", "anthropic/claude-sonnet-4-20250514", "openrouter/qwen/qwen3-235b-a22b"]
    }
}
```

## 5. Environment Variables Setup

### For Render (Backend):
Add these environment variables to your Render backend service:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### For Vercel (Frontend):
Add these environment variables to your Vercel frontend:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
```

## 6. Webhook Setup

### Step 1: Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Set endpoint URL to: `https://goata-backend-ap.onrender.com/api/webhooks/stripe`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Step 2: Copy Webhook Secret
After creating the webhook, copy the **Signing Secret** and use it as `STRIPE_WEBHOOK_SECRET`

## 7. How the Current System Works

### Billing Flow:
1. **User Selection**: User selects a plan on the pricing page
2. **Checkout Creation**: Frontend calls backend to create Stripe checkout session
3. **Payment Processing**: Stripe handles payment securely
4. **Webhook Processing**: Stripe sends webhook to backend when subscription is created/updated
5. **Access Control**: Backend updates user permissions based on subscription tier
6. **Usage Tracking**: System tracks usage and enforces limits

### Key Backend Functions:
- `get_subscription()` - Gets current user subscription status
- `check_billing_status()` - Checks if user can run operations
- `get_allowed_models_for_user()` - Returns available models for user's tier
- `create_checkout_session()` - Creates Stripe checkout for subscriptions
- `handle_stripe_webhook()` - Processes Stripe events

### Manual Subscription Fallback:
The system includes a manual subscription system in Supabase `billing_subscriptions` table as a fallback when Stripe is unavailable.

## 8. Testing Your Setup

### Step 1: Test Mode First
1. Use test keys (`pk_test_` and `sk_test_`) initially
2. Create test products and prices in Stripe test mode
3. Test the subscription flow on your staging environment

### Step 2: Test Subscription Flow
1. Go to your GOATA frontend
2. Navigate to billing/pricing section
3. Try subscribing to each tier
4. Verify the checkout process works
5. Check Stripe Dashboard for successful payments

### Step 3: Test Webhooks
1. Make a test subscription
2. Check your backend logs for webhook processing
3. Verify user access is updated accordingly
4. Test model access restrictions

## 9. Go Live Checklist

### Before Going Live:
- [ ] All 8 products created in Stripe
- [ ] All 8 prices configured correctly ($0, $20, $50, $100, $200, $400, $800, $1000)
- [ ] Live API keys generated and configured
- [ ] Webhook endpoint set up with live URL
- [ ] All environment variables updated in Render and Vercel
- [ ] Frontend config updated with new price IDs
- [ ] Backend config updated with new price IDs
- [ ] Test subscription flow end-to-end
- [ ] Webhook processing tested and working

### After Going Live:
- [ ] Monitor Stripe Dashboard for subscriptions
- [ ] Check backend logs for any errors
- [ ] Test a few live subscriptions
- [ ] Verify billing calculations are correct
- [ ] Verify usage limits are enforced
- [ ] Test model access restrictions

## 10. Important Notes

### Current Environment Setup:
- **Frontend**: Deployed on Vercel (https://www.goata.app)
- **Backend**: Deployed on Render (https://goata-backend-ap.onrender.com)
- **Environment Detection**: Based on `NEXT_PUBLIC_ENV_MODE` environment variable

### Key Points:
1. **Price IDs are environment-specific** - You'll need separate Price IDs for test and live mode
2. **Webhook secrets are different** for each webhook endpoint
3. **The billing logic is already implemented** - you just need to update configuration
4. **Model access is tied to subscription tiers** - defined in constants.py
5. **The frontend automatically uses correct price IDs** based on environment configuration
6. **Manual subscription fallback exists** - check Supabase `billing_subscriptions` table
7. **Usage is tracked in minutes** - converted from hours (e.g., 2h = 120 minutes)

### Staging vs Production:
The system supports both staging and production configurations with separate price IDs. Update both STAGING_TIERS and PROD_TIERS if you want staging environment.

This setup will give you an exact replica of the current billing system with your own Stripe account. The application will handle subscription management, usage tracking, and model access control automatically.

## 11. Troubleshooting

### Common Issues:
1. **Wrong Price IDs**: Double-check that price IDs match between Stripe and your config
2. **Webhook Failures**: Ensure webhook URL is correct and endpoints are reachable
3. **Environment Variables**: Verify all Stripe keys are set correctly in deployment platforms
4. **Test vs Live Mode**: Make sure you're using consistent test/live keys across all services

### Manual Subscription Setup:
If you need to manually set up a subscription for testing (like spaceguildevents@gmail.com), you can insert directly into the Supabase `billing_subscriptions` table with the appropriate tier and limits.