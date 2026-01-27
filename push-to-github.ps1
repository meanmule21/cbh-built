# Script to push to GitHub bypassing proxy settings
# Run this script: .\push-to-github.ps1

Write-Host "Configuring git to bypass proxy..." -ForegroundColor Yellow

# Unset proxy environment variables for this session
$env:HTTP_PROXY = $null
$env:HTTPS_PROXY = $null
$env:http_proxy = $null
$env:https_proxy = $null

# Configure git to not use proxy
git config --global http.proxy ""
git config --global https.proxy ""
git config --global http.https://github.com.proxy ""

Write-Host "Attempting to push to GitHub..." -ForegroundColor Green

# Try to push
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Try with NO_PROXY set
    $env:NO_PROXY = "*"
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "`nPush still failed. Please check:" -ForegroundColor Red
        Write-Host "1. Your internet connection" -ForegroundColor Red
        Write-Host "2. GitHub token in remote URL (might be expired)" -ForegroundColor Red
        Write-Host "3. Try running: git push origin main manually" -ForegroundColor Red
    }
}
