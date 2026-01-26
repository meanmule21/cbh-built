# Fix NPM Proxy Issues
# This script clears proxy settings and configures npm to work without proxy
# Run this before any npm commands: .\fix-npm-proxy.ps1

Write-Host "Fixing NPM proxy issues..." -ForegroundColor Yellow

# Clear environment variables for this session
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
$env:NPM_CONFIG_OFFLINE = "false"
$env:NPM_CONFIG_PREFER_OFFLINE = "false"
$env:NPM_CONFIG_PROXY = ""
$env:NPM_CONFIG_HTTPS_PROXY = ""

# Remove from environment (if they exist)
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:https_proxy -ErrorAction SilentlyContinue
Remove-Item Env:NPM_CONFIG_OFFLINE -ErrorAction SilentlyContinue
Remove-Item Env:NPM_CONFIG_PREFER_OFFLINE -ErrorAction SilentlyContinue

Write-Host "`nConfiguring npm..." -ForegroundColor Cyan

# Configure npm to not use proxy
npm config set registry https://registry.npmjs.org/
npm config set offline false
npm config set prefer-offline false
npm config set strict-ssl true
npm config delete proxy -ErrorAction SilentlyContinue
npm config delete https-proxy -ErrorAction SilentlyContinue

# Create/update .npmrc in project directory to override system settings
$npmrcPath = Join-Path $PSScriptRoot ".npmrc"
$npmrcContent = @"
registry=https://registry.npmjs.org/
offline=false
prefer-offline=false
strict-ssl=true
"@

Set-Content -Path $npmrcPath -Value $npmrcContent -Force
Write-Host "Updated .npmrc file in project directory" -ForegroundColor Green

Write-Host "`nTesting npm connectivity..." -ForegroundColor Cyan
npm ping

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ NPM proxy issue fixed! npm is now working." -ForegroundColor Green
    Write-Host "`nYou can now run npm commands. If you open a new terminal," -ForegroundColor Cyan
    Write-Host "run this script again or set the environment variables manually." -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  NPM still has issues. The proxy may be set at system level." -ForegroundColor Yellow
    Write-Host "`nTo fix permanently:" -ForegroundColor Yellow
    Write-Host "1. Press Win+R, type 'sysdm.cpl', press Enter" -ForegroundColor White
    Write-Host "2. Go to Advanced → Environment Variables" -ForegroundColor White
    Write-Host "3. Remove HTTP_PROXY, HTTPS_PROXY, http_proxy, https_proxy from User/System variables" -ForegroundColor White
    Write-Host "4. Remove NPM_CONFIG_OFFLINE if present" -ForegroundColor White
    Write-Host "5. Restart PowerShell and try again" -ForegroundColor White
}
