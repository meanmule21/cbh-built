# Stripe Integration Setup - Manual Steps

Since npm install encountered cache issues, please follow these steps to complete the setup:

## Step 1: Install Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
npm install stripe @stripe/stripe-js
```

If that doesn't work, try:
```bash
npm install --legacy-peer-deps stripe @stripe/stripe-js
```

Or if you're using yarn:
```bash
yarn add stripe @stripe/stripe-js
```

## Step 2: Environment Variables

✅ **Already Done!** The `.env.local` file has been created with your Stripe keys:
- `STRIPE_SECRET_KEY` - Your test secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your test publishable key

## Step 3: Verify Installation

After installing the packages, verify they're in `package.json`:
- `stripe` (version ^17.0.0)
- `@stripe/stripe-js` (version ^4.0.0)

Check `node_modules` folder to confirm the packages are installed.

## Step 4: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the checkout page and test with:
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC
   - Any ZIP code

## Step 5: Set Up Webhooks (Optional for now)

For local development, you can set up webhooks later using Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Then add the webhook secret to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## What's Already Configured

✅ Stripe API routes created:
- `/api/checkout/session` - Creates checkout sessions
- `/api/checkout/session/verify` - Verifies payment sessions
- `/api/stripe-webhook` - Handles webhook events

✅ Checkout page updated to use Stripe
✅ Success page updated to display order details
✅ Environment variables configured
✅ Package.json updated with Stripe dependencies

## Troubleshooting

If you encounter issues:

1. **"Stripe publishable key is not configured"**
   - Make sure `.env.local` exists and has `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Restart the dev server after adding environment variables

2. **Module not found errors**
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **Build errors**
   - Make sure all dependencies are installed
   - Check that TypeScript can find the Stripe types

## Next Steps After Installation

1. Test the checkout flow end-to-end
2. Set up webhooks for production
3. Switch to live Stripe keys when ready for production
4. Configure order fulfillment workflow
