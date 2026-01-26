# Final Push Script - Run this in a fresh PowerShell window
# This script permanently fixes proxy issues and pushes to GitHub

Write-Host "=== Final Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Permanently clear proxy environment variables
Write-Host "Step 1: Clearing proxy settings..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("HTTP_PROXY", $null, "User")
[System.Environment]::SetEnvironmentVariable("HTTPS_PROXY", $null, "User")
[System.Environment]::SetEnvironmentVariable("http_proxy", $null, "User")
[System.Environment]::SetEnvironmentVariable("https_proxy", $null, "User")

# Clear from current session
Remove-Item Env:\HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:\http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:\https_proxy -ErrorAction SilentlyContinue

$env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"

Write-Host "✓ Proxy settings cleared" -ForegroundColor Green

# Step 2: Configure Git
Write-Host "`nStep 2: Configuring Git..." -ForegroundColor Yellow
git config --global http.https://github.com/.proxy ""
git config --global credential.helper manager-core
git config --global http.sslVerify true

Write-Host "✓ Git configured" -ForegroundColor Green

# Step 3: Set remote with token
Write-Host "`nStep 3: Setting up remote with token..." -ForegroundColor Yellow
$token = "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"
$username = "meanmule21"
git remote set-url origin "https://${username}:${token}@github.com/${username}/cbh-built.git"

Write-Host "✓ Remote configured" -ForegroundColor Green

# Step 4: Push
Write-Host "`nStep 4: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

$pushResult = git push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "Vercel will automatically deploy your changes." -ForegroundColor Green
    
    # Clean up - remove token from URL
    git remote set-url origin "https://github.com/${username}/cbh-built.git"
    Write-Host "`n✓ Cleaned up remote URL (token removed for security)" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Error:" -ForegroundColor Red
    Write-Host $pushResult -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're connected to the internet" -ForegroundColor White
    Write-Host "2. Check if GitHub is accessible: Test-NetConnection github.com -Port 443" -ForegroundColor White
    Write-Host "3. Try using GitHub Desktop or another Git client" -ForegroundColor White
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
