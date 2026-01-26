# GitHub Push Guide - Fix Authentication Issues

## Current Issue
Git needs authentication credentials to push to GitHub. The error `SEC_E_NO_CREDENTIALS` means no credentials are stored.

## Solution Options

### Option 1: Use Personal Access Token (Easiest)

1. **Generate a Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**
   - Name it: "Vercel Deployment"
   - Select scope: **`repo`** (full control of private repositories)
   - Click **"Generate token"**
   - **Copy the token immediately** (you won't see it again!)

2. **Push with Token:**
   ```powershell
   cd c:\Users\injec\Downloads\cbh-built-main
   git push origin main
   ```
   - When prompted for **Username**: Enter your GitHub username (`meanmule21`)
   - When prompted for **Password**: Paste the token (not your GitHub password)

3. **Store Credentials (Optional):**
   ```powershell
   git config --global credential.helper wincred
   ```
   This will save your credentials for future pushes.

### Option 2: Switch to SSH (Recommended for Long-term)

1. **Check if you have SSH keys:**
   ```powershell
   Test-Path $env:USERPROFILE\.ssh\id_rsa.pub
   ```

2. **If no SSH key, generate one:**
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Press Enter twice for no passphrase (or set one)
   ```

3. **Add SSH key to GitHub:**
   ```powershell
   Get-Content $env:USERPROFILE\.ssh\id_rsa.pub
   ```
   - Copy the output
   - Go to: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Paste the key and save

4. **Switch remote to SSH:**
   ```powershell
   cd c:\Users\injec\Downloads\cbh-built-main
   git remote set-url origin git@github.com:meanmule21/cbh-built.git
   git push origin main
   ```

### Option 3: Use GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Open the repository
4. Click "Push origin" button

### Option 4: Use Git Credential Manager

```powershell
# Install Git Credential Manager (if not installed)
winget install Microsoft.GitCredentialManager

# Configure Git to use it
git config --global credential.helper manager-core

# Try pushing again
git push origin main
```

## Quick Fix Script

Run this script to help with the push:

```powershell
.\push-to-github.ps1
```

## After Successful Push

Once your code is on GitHub:
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `cbh-built` repository
4. Click "Deploy"

Vercel will automatically deploy your site!
