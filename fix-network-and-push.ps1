# Fix Network Issues and Push to GitHub
# This script clears proxy settings and helps push to GitHub

Write-Host "Fixing network configuration..." -ForegroundColor Cyan

# Clear proxy environment variables
Remove-Item Env:\HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:\https_proxy -ErrorAction SilentlyContinue

# Set NO_PROXY for GitHub
$env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"

# Configure Git to bypass proxy for GitHub
git config --global http.https://github.com/.proxy ""

Write-Host "`nNetwork configuration fixed!" -ForegroundColor Green
Write-Host "`nAttempting to push..." -ForegroundColor Yellow

# Try to push
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Vercel will automatically deploy your changes." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Push requires authentication." -ForegroundColor Yellow
    Write-Host "`nTo complete the push, you need to:" -ForegroundColor White
    Write-Host "1. Generate a GitHub Personal Access Token:" -ForegroundColor White
    Write-Host "   https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host "2. When prompted, use your GitHub username and the token as password" -ForegroundColor White
    Write-Host "`nOr run: git push origin main" -ForegroundColor White
    Write-Host "   and enter credentials when prompted" -ForegroundColor White
}
