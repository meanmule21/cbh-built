# Quick push script for https://github.com/meanmule21/cbh-built
# Run this in PowerShell where git is available

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Repository: https://github.com/meanmule21/cbh-built" -ForegroundColor Gray
Write-Host ""

# Initialize if needed
if (-not (Test-Path .git)) {
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
}

# Add remote
git remote remove origin 2>$null
git remote add origin https://github.com/meanmule21/cbh-built.git
Write-Host "✓ Remote configured" -ForegroundColor Green

# Stage all
git add .
Write-Host "✓ Files staged" -ForegroundColor Green

# Commit
git commit -m "Convert to self-contained site - remove all external dependencies" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "⚠ Nothing new to commit" -ForegroundColor Yellow
}

# Check current branch
$branch = git branch --show-current 2>$null
if (-not $branch) {
    $branch = "main"
    git checkout -b main 2>&1 | Out-Null
}

Write-Host ""
Write-Host "Force pushing to $branch branch..." -ForegroundColor Yellow
Write-Host "⚠ This will overwrite the remote branch!" -ForegroundColor Red
Write-Host ""

git push -f origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/meanmule21/cbh-built" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Authenticate with GitHub (git credential helper)" -ForegroundColor Yellow
    Write-Host "2. Check your internet connection" -ForegroundColor Yellow
    Write-Host "3. Verify you have push access to the repository" -ForegroundColor Yellow
}
