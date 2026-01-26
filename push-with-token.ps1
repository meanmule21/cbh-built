# Push to GitHub with token
# This script clears proxy and pushes using the provided token

$token = "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"
$username = "meanmule21"
$repo = "meanmule21/cbh-built"

Write-Host "Configuring Git for push..." -ForegroundColor Cyan

# Clear all proxy settings
Remove-Item Env:\HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:\https_proxy -ErrorAction SilentlyContinue
$env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"

# Configure Git
git config --global http.https://github.com/.proxy ""
git config --global credential.helper store

# Store credentials
$credFile = "$env:USERPROFILE\.git-credentials"
"https://${username}:${token}@github.com" | Out-File -FilePath $credFile -Encoding utf8 -NoNewline

# Set remote URL with token
git remote set-url origin "https://${username}:${token}@github.com/${repo}.git"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Vercel will automatically deploy your changes." -ForegroundColor Green
    
    # Clean up - remove token from remote URL for security
    git remote set-url origin "https://github.com/${repo}.git"
    Write-Host "`nCleaned up remote URL (token removed for security)" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Push failed. Error code: $LASTEXITCODE" -ForegroundColor Red
}
