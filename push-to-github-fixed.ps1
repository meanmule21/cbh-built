# Script to push to GitHub by bypassing proxy issues
# Run this in your own PowerShell terminal

cd c:\Users\injec\Downloads\cbh-built-main

Write-Host "Clearing proxy environment variables..." -ForegroundColor Yellow

# Remove proxy environment variables
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:https_proxy -ErrorAction SilentlyContinue

# Set empty proxy for git
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""

# Configure git to not use proxy
git config --global http.proxy ""
git config --global https.proxy ""
git config --global http.https://github.com.proxy ""

Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

Write-Host "`nAttempting to push to GitHub..." -ForegroundColor Cyan
git push --set-upstream origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Push failed. Error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host "`nTrying alternative method with NO_PROXY..." -ForegroundColor Yellow
    
    $env:NO_PROXY = "github.com,*.github.com"
    git push --set-upstream origin main --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Still failing. You may need to:" -ForegroundColor Red
        Write-Host "   1. Remove proxy settings from System Environment Variables" -ForegroundColor Yellow
        Write-Host "   2. Use SSH instead: git remote set-url origin git@github.com:meanmule21/cbh-built.git" -ForegroundColor Yellow
        Write-Host "   3. Use GitHub Desktop or another Git client" -ForegroundColor Yellow
    }
}
