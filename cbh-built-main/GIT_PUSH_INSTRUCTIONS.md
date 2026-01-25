# Git Push Instructions

Since git is not available in the current environment, follow these steps to push your changes to GitHub:

## Option 1: Using PowerShell Script (Recommended)

1. Open PowerShell or Command Prompt where git is available
2. Navigate to your project:
   ```powershell
   cd c:\Users\injec\Downloads\cbh-built-main\cbh-built-main
   ```
3. Run the script:
   ```powershell
   .\push-to-github.ps1
   ```
4. Follow the prompts to add your GitHub repository URL

## Option 2: Manual Commands

If you prefer to run commands manually:

### Step 1: Initialize Git (if not already)
```bash
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Commit Changes
```bash
git commit -m "Convert to self-contained site - remove all external dependencies"
```

### Step 4: Add GitHub Remote (if not already)
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

### Step 5: Force Push
```bash
# For main branch
git push -f origin main

# OR if your default branch is master
git push -f origin master
```

## Option 3: Using GitHub Desktop

1. Open GitHub Desktop
2. Add the repository: File → Add Local Repository
3. Select: `c:\Users\injec\Downloads\cbh-built-main\cbh-built-main`
4. Commit all changes
5. Push to GitHub (with force push option if needed)

## Important Notes

⚠️ **Force Push Warning**: Force pushing (`-f` flag) will overwrite the remote branch. Make sure you want to do this!

If you don't have a GitHub repository yet:
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Create a new repository (don't initialize with README)
4. Copy the repository URL
5. Use it in the commands above
