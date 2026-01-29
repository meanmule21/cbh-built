# Push local commits to GitHub (remote)
# Run this in PowerShell: right-click -> Run with PowerShell, or open PowerShell and run:
#   cd "c:\Users\injec\Downloads\cbh-built-main"
#   .\push-to-remote.ps1

Write-Host "=== Push to Remote ===" -ForegroundColor Cyan
Write-Host ""

# Clear proxy so Git can reach GitHub
$env:HTTP_PROXY = $null
$env:HTTPS_PROXY = $null
$env:http_proxy = $null
$env:https_proxy = $null
$env:NO_PROXY = "*"
git config --global http.proxy ""
git config --global https.proxy ""
git config --global http.https://github.com.proxy ""

Write-Host "Pushing to origin main..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Your updates are now on GitHub." -ForegroundColor Green
    Write-Host "If you use Vercel, the site will deploy in 2-3 minutes." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed. Try:" -ForegroundColor Red
    Write-Host "1. Run this script from a NEW PowerShell window (not Cursor)" -ForegroundColor Yellow
    Write-Host "2. If token expired: create new token at https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "   Then run: git remote set-url origin https://meanmule21:YOUR_NEW_TOKEN@github.com/meanmule21/cbh-built.git" -ForegroundColor Yellow
}
Write-Host ""
