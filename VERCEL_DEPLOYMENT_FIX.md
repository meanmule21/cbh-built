# Vercel Deployment Fix Guide

## Common Issues and Solutions

### 1. Build Command Issues
- ✅ Fixed: Added proper `vercel.json` with correct build commands
- ✅ Fixed: Updated `next.config.ts` to remove `output: 'standalone'` (not needed for Vercel)

### 2. Node Version
- ✅ Fixed: Added `engines` field to `package.json` specifying Node >=18.0.0

### 3. Dependencies
- ✅ All dependencies are properly listed in `package.json`
- ✅ No missing Supabase dependencies (removed)

### 4. Configuration Files
- ✅ Created `vercel.json` in root directory
- ✅ Updated `next.config.ts` with proper Vercel settings

## Steps to Deploy

1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Verify these settings:
     - **Framework Preset:** Next.js
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next` (auto-detected)
     - **Install Command:** `npm install`
     - **Node.js Version:** 18.x or 20.x (Vercel will auto-detect)

3. **Environment Variables:**
   - None required (site is self-contained)

4. **Redeploy:**
   - If deployment fails, click "Redeploy" in Vercel dashboard
   - Check build logs for specific errors

## Troubleshooting

### If build still fails:

1. **Check build logs in Vercel:**
   - Look for specific error messages
   - Common errors:
     - Missing dependencies
     - TypeScript errors
     - Import errors

2. **Test build locally:**
   ```bash
   npm install
   npm run build
   ```
   - If local build fails, fix those errors first

3. **Clear Vercel cache:**
   - In Vercel dashboard → Settings → General
   - Click "Clear Build Cache"
   - Redeploy

4. **Check Node version:**
   - Vercel should use Node 18+ automatically
   - If needed, specify in `package.json` engines field (already added)

## Files Updated

- ✅ `package.json` - Added engines field
- ✅ `next.config.ts` - Optimized for Vercel
- ✅ `vercel.json` - Created with proper configuration
