# Quick Deployment Guide

## Option 1: Deploy via Vercel Web Interface (Easiest - No CLI needed)

1. **Push your code to GitHub** (if not already):
   - Create a new repository on GitHub
   - Upload your code to the repository

2. **Deploy on Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Your site will be live!** 🎉

## Option 2: Deploy via Vercel CLI

### Prerequisites:
- Node.js installed
- Vercel account

### Steps:

1. **Install Vercel CLI** (if not installed):
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Link your project** (first time only):
   ```powershell
   vercel link
   ```
   - Choose to create a new project or link to existing one

4. **Deploy**:
   ```powershell
   vercel --prod
   ```

   Or use the automated script:
   ```powershell
   .\deploy.ps1
   ```

## Option 3: Automated Setup Script

Run the setup script which handles everything:
```powershell
.\setup-vercel.ps1
```

## After Deployment

Your site will be available at: `https://your-project-name.vercel.app`

**Note:** The website is fully self-contained and works without any environment variables or external services!

## Troubleshooting

- **Build fails?** Check the build logs in Vercel dashboard
- **Can't find Node.js?** Install from [nodejs.org](https://nodejs.org/)
- **Need help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
