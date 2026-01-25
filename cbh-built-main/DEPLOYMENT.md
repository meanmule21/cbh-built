# Vercel Deployment Guide

This project is configured for deployment on Vercel.

## Quick Setup

### Option 1: Automated Setup (Recommended)
Run the setup script:
```powershell
.\setup-vercel.ps1
```

### Option 2: Manual Setup

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```
   This will open your browser for authentication.

3. **Link your project**:
   ```bash
   vercel link
   ```
   - Choose to create a new project or link to existing one
   - Follow the prompts

4. **Deploy**:
   ```bash
   vercel          # Preview deployment
   vercel --prod   # Production deployment
   ```

## Environment Variables

### Environment Variables

**No environment variables are required!** This site is self-contained and works with mock/local data.

### Optional Variables:
- `NEXT_PUBLIC_BASE_URL` - Your production domain (auto-detected if not set)

## Continuous Deployment

If you connect your GitHub repository to Vercel:
- Every push to `main` branch will trigger a production deployment
- Pull requests will create preview deployments automatically

## Troubleshooting

### Build Fails
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard
- Ensure all dependencies are installed (`npm install`)

