# Script to initialize git, commit, and force push to GitHub
# Run this in PowerShell where git is available

Write-Host "🚀 Git Push Script" -ForegroundColor Cyan
Write-Host ""

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Open a terminal where git is available" -ForegroundColor White
    Write-Host "2. Navigate to: $projectDir" -ForegroundColor White
    Write-Host "3. Run the commands manually (see below)" -ForegroundColor White
    exit 1
}

Write-Host "✓ Git found" -ForegroundColor Green
Write-Host ""

# Initialize git if needed
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# GitHub repository URL
$repoUrl = "https://github.com/meanmule21/cbh-built.git"

# Check if there's a remote
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "✓ Remote added: $repoUrl" -ForegroundColor Green
} else {
    # Update remote URL if it's different
    if ($remote -ne $repoUrl) {
        Write-Host "Updating remote URL..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
        Write-Host "✓ Remote updated: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "✓ Remote found: $remote" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Staging all changes..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
$commitMessage = "Convert to self-contained site - remove all external dependencies"
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Nothing to commit or commit failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Force pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠ WARNING: This will overwrite the remote branch!" -ForegroundColor Red
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -eq "yes") {
    git push -f origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Successfully force pushed to GitHub!" -ForegroundColor Green
    } else {
        # Try master branch if main doesn't exist
        Write-Host "Trying 'master' branch..." -ForegroundColor Yellow
        git push -f origin master
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Successfully force pushed to GitHub!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Check your git configuration and remote URL." -ForegroundColor Red
        }
    }
} else {
    Write-Host "Push cancelled." -ForegroundColor Yellow
}
