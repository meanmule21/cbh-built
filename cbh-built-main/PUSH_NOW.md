# Quick Push to GitHub

Your repository: **https://github.com/meanmule21/cbh-built**

## Fastest Method

Open PowerShell/Command Prompt where git is available and run:

```powershell
cd c:\Users\injec\Downloads\cbh-built-main\cbh-built-main
.\quick-push.ps1
```

## Manual Method

If the script doesn't work, run these commands:

```bash
cd c:\Users\injec\Downloads\cbh-built-main\cbh-built-main

# Initialize git (if needed)
git init

# Add remote
git remote remove origin 2>$null
git remote add origin https://github.com/meanmule21/cbh-built.git

# Stage all files
git add .

# Commit
git commit -m "Convert to self-contained site - remove all external dependencies"

# Force push
git push -f origin main
```

If your default branch is `master` instead of `main`:
```bash
git push -f origin master
```

## Authentication

If you get authentication errors:
- Use a Personal Access Token instead of password
- Or use GitHub Desktop
- Or use SSH keys

## Done!

After pushing, your changes will be live at:
- GitHub: https://github.com/meanmule21/cbh-built
- Vercel will auto-deploy if connected
