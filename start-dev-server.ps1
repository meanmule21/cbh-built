# Start Development Server Script
# This script fixes proxy issues and starts the Next.js dev server
# Run this in your own PowerShell terminal: .\start-dev-server.ps1

Write-Host "Fixing proxy and npm configuration..." -ForegroundColor Yellow

# Clear all proxy environment variables
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:http_proxy -ErrorAction SilentlyContinue
Remove-Item Env:https_proxy -ErrorAction SilentlyContinue
Remove-Item Env:NPM_CONFIG_OFFLINE -ErrorAction SilentlyContinue

# Set empty values
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
$env:NPM_CONFIG_OFFLINE = "false"

# Configure npm
npm config set proxy ""
npm config set https-proxy ""
npm config set offline false
npm config set prefer-offline false
npm config set registry https://registry.npmjs.org/

Write-Host "`nChecking if dependencies are installed..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules\next")) {
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ npm install failed. You may need to:" -ForegroundColor Red
        Write-Host "   1. Remove proxy settings from System Environment Variables" -ForegroundColor Yellow
        Write-Host "   2. Press Win+R, type 'sysdm.cpl', press Enter" -ForegroundColor Yellow
        Write-Host "   3. Go to Advanced → Environment Variables" -ForegroundColor Yellow
        Write-Host "   4. Remove HTTP_PROXY, HTTPS_PROXY from User/System variables" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host "`nStarting development server..." -ForegroundColor Cyan
Write-Host "The site will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev
