# Push to GitHub Helper Script
# This script helps push your code to GitHub with proper authentication

Write-Host "GitHub Push Helper" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

# Set NO_PROXY for GitHub
$env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"

# Check current status
Write-Host "`nChecking git status..." -ForegroundColor Yellow
git status

# Check if there are commits to push
$commitsAhead = git rev-list --count origin/main..HEAD 2>$null
if ($commitsAhead -eq 0) {
    Write-Host "`n✅ No commits to push. Everything is up to date." -ForegroundColor Green
    exit 0
}

Write-Host "`nYou have $commitsAhead commit(s) to push." -ForegroundColor Yellow

# Check remote URL
$remoteUrl = git remote get-url origin
Write-Host "`nRemote URL: $remoteUrl" -ForegroundColor Cyan

if ($remoteUrl -like "*https://*") {
    Write-Host "`n⚠️  Using HTTPS - Authentication required" -ForegroundColor Yellow
    Write-Host "`nOptions:" -ForegroundColor White
    Write-Host "1. Use GitHub Personal Access Token" -ForegroundColor White
    Write-Host "2. Switch to SSH (recommended)" -ForegroundColor White
    Write-Host "3. Use GitHub Desktop or another Git client" -ForegroundColor White
    
    Write-Host "`nTrying to push with current credentials..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Push failed. Authentication required." -ForegroundColor Red
        Write-Host "`nTo fix this:" -ForegroundColor Yellow
        Write-Host "1. Generate a Personal Access Token:" -ForegroundColor White
        Write-Host "   - Go to: https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "   - Click 'Generate new token (classic)'" -ForegroundColor White
        Write-Host "   - Select 'repo' scope" -ForegroundColor White
        Write-Host "   - Copy the token" -ForegroundColor White
        Write-Host "`n2. When prompted for password, paste the token" -ForegroundColor White
        Write-Host "`nOR switch to SSH:" -ForegroundColor Yellow
        Write-Host "   git remote set-url origin git@github.com:meanmule21/cbh-built.git" -ForegroundColor White
    }
} else {
    Write-Host "`nUsing SSH - attempting push..." -ForegroundColor Yellow
    git push origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`nYour code is now on GitHub and ready for Vercel deployment." -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Error code: $LASTEXITCODE" -ForegroundColor Red
}
