# Connect GitHub to Vercel

This guide will help you connect your GitHub repository (`https://github.com/meanmule21/cbh-built`) to Vercel for automatic deployments.

## Method 1: Via Vercel Dashboard (Recommended)

### Step 1: Sign in to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** to authenticate with your GitHub account

### Step 2: Import Your Repository
1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **`cbh-built`** in the list
4. Click **"Import"** next to it

### Step 3: Configure Project Settings
Vercel will auto-detect Next.js, but verify these settings:

- **Framework Preset**: `Next.js` (should be auto-detected)
- **Root Directory**: `./` (or leave default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 4: Environment Variables
Since this is a self-contained site, **no environment variables are needed**. You can skip this step.

### Step 5: Deploy
1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to production

### Step 6: Automatic Deployments
Once connected, Vercel will automatically:
- ✅ Deploy every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Rebuild on every commit

## Method 2: Via Vercel CLI

If you prefer using the command line:

```powershell
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Link your project to GitHub
cd c:\Users\injec\Downloads\cbh-built-main\cbh-built-main
vercel link

# Follow the prompts:
# - Set up and develop? [Y/n] n
# - Which scope? [Select your account]
# - Link to existing project? [Y/n] n
# - Project name? cbh-built
# - Directory? ./
# - Override settings? [y/N] n

# Deploy
vercel --prod
```

## Verification

After connecting, you can verify the connection:

1. Go to your Vercel dashboard
2. Click on your project (`cbh-built`)
3. Go to **Settings** → **Git**
4. You should see:
   - **Git Repository**: `meanmule21/cbh-built`
   - **Production Branch**: `main`
   - **Deploy Hooks**: Enabled

## Troubleshooting

### If the repository doesn't appear:
1. Make sure you're logged in with the correct GitHub account
2. Check that the repository is public, or that Vercel has access to your private repos
3. Go to GitHub → Settings → Applications → Authorized OAuth Apps → Vercel → Grant access

### If build fails:
- Check the build logs in Vercel dashboard
- Ensure `package.json` has all required dependencies
- Verify `next.config.ts` is properly configured

### If you need to reconnect:
1. Go to Vercel Dashboard → Project Settings → Git
2. Click **"Disconnect"** to remove the connection
3. Follow the import steps again

## Next Steps

Once connected:
- Every push to `main` will trigger a production deployment
- Pull requests will get preview URLs
- You can view deployment history in the Vercel dashboard
- Your site will be available at `https://cbh-built.vercel.app` (or your custom domain)

## Current Status

✅ **Repository**: `https://github.com/meanmule21/cbh-built`  
✅ **Vercel Config**: `vercel.json` is configured  
✅ **Next.js Config**: Optimized for Vercel  
✅ **Dependencies**: Clean (no external API keys needed)  
⏳ **Connection**: Needs to be done via Vercel dashboard
