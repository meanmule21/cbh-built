# Stripe Integration Setup Guide

This guide will help you complete the Stripe integration setup for your Custom Business Hats website.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Stripe API keys (already provided)

## Step 1: Install Dependencies

Run the following command to install the Stripe packages:

```bash
npm install stripe @stripe/stripe-js
```

## Step 2: Configure Environment Variables

1. Copy `env.example.txt` to `.env.local`:
   ```bash
   cp env.example.txt .env.local
   ```

2. Open `.env.local` and ensure the following Stripe variables are set:
   ```
   STRIPE_SECRET_KEY=sk_test_51SrCqA0oWx3GRApQy1p8ejE2HChSLxzRISJ7naRoFkyHl6z28VirxLxWRlgwMPi4S3cUMYoxv6MjPPWC9kR3kNKM00FmbpblRE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SrCqA0oWx3GRApQIralOcJunjyIbod5LLHQfVhzDbFDnpc6piIRziH0wJGzBYW0gMGxBTZRUnlNoWFYKVdrCbCC00AJ8ffMkA
   ```

   **Note:** These are test keys. For production, you'll need to:
   - Switch to live mode in your Stripe Dashboard
   - Get your live API keys
   - Update the environment variables

## Step 3: Set Up Stripe Webhook (Important!)

Webhooks allow Stripe to notify your server when payment events occur.

### For Local Development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### For Production (Vercel/Deployed Site):

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your production environment variables

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go through the checkout flow:
   - Add items to cart
   - Fill in order details
   - Click "Pay Now"
   - You should be redirected to Stripe Checkout

3. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date, any CVC, and any ZIP code

4. After successful payment, you should be redirected to the success page with order details

## Step 5: Production Checklist

Before going live:

- [ ] Switch Stripe to live mode
- [ ] Update environment variables with live keys
- [ ] Set up production webhook endpoint
- [ ] Test a real transaction (with a small amount)
- [ ] Verify webhook events are being received
- [ ] Set up order fulfillment workflow
- [ ] Configure email notifications (if needed)

## How It Works

1. **Checkout Page** (`/order/checkout`):
   - User reviews order and clicks "Pay Now"
   - Frontend calls `/api/checkout/session` to create a Stripe Checkout session
   - User is redirected to Stripe Checkout

2. **Stripe Checkout**:
   - User enters payment details
   - Stripe processes the payment

3. **Success Page** (`/order/success`):
   - After successful payment, user is redirected back
   - Page calls `/api/checkout/session/verify` to fetch order details
   - Order details are displayed to the user

4. **Webhook Handler** (`/api/stripe-webhook`):
   - Stripe sends webhook events when payments complete
   - You can use this to:
     - Save orders to your database
     - Send confirmation emails
     - Update inventory
     - Trigger order fulfillment

## Troubleshooting

### "Stripe publishable key is not configured"
- Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Restart your dev server after adding environment variables

### Webhook signature verification fails
- Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
- For local development, use the secret from `stripe listen` command
- For production, use the secret from your Stripe Dashboard webhook settings

### Payment succeeds but order details don't show
- Check that the webhook is configured correctly
- Verify the session verification API route is working
- Check browser console and server logs for errors

## Support

For Stripe-specific issues, check:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
