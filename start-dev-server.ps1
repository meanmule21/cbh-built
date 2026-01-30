# Start Development Server Script
# This script fixes proxy issues and starts the Next.js dev server
#
# IMPORTANT: Run this in Windows PowerShell or Terminal *outside Cursor*
# (not in Cursor's integrated terminal). Then open http://localhost:3000
# or http://127.0.0.1:3000 in your browser (use http, not https).
#
# Run from project folder:  cd "C:\Users\injec\Downloads\cbh-built-main"  then  .\start-dev-server.ps1
# Or use full path:         & "C:\Users\injec\Downloads\cbh-built-main\start-dev-server.ps1"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $scriptDir "package.json"))) {
    Write-Host "Error: package.json not found. Run this script from the project folder (cbh-built-main)." -ForegroundColor Red
    Write-Host "  cd `"$scriptDir`"" -ForegroundColor Yellow
    Write-Host "  .\start-dev-server.ps1" -ForegroundColor Yellow
    exit 1
}
Set-Location $scriptDir

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
        Write-Host "`nnpm install failed. You may need to:" -ForegroundColor Red
        Write-Host "   1. Remove proxy settings from System Environment Variables" -ForegroundColor Yellow
        Write-Host "   2. Press Win+R, type 'sysdm.cpl', press Enter" -ForegroundColor Yellow
        Write-Host "   3. Go to Advanced -> Environment Variables" -ForegroundColor Yellow
        Write-Host "   4. Remove HTTP_PROXY, HTTPS_PROXY from User/System variables" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# Clear .next to avoid EPERM / "localhost won't show" (file locks, concurrent Next.js)
if (Test-Path ".next") {
    Write-Host "`nClearing .next cache (avoids EPERM / localhost issues)..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

Write-Host "`nStarting development server..." -ForegroundColor Cyan
Write-Host "Open in browser (use http, not https):" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Green
Write-Host "  http://127.0.0.1:3000" -ForegroundColor Green
Write-Host "If localhost won't load: close other npm run dev terminals, use 127.0.0.1 if localhost fails, or run this script from PowerShell *outside* Cursor." -ForegroundColor Gray
# Show local IP so other devices can connect
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback|Bluetooth" -and $_.IPAddress -notmatch "^169\.254" } | Select-Object -First 1).IPAddress
if ($localIp) {
    Write-Host "Other devices on your network: http://${localIp}:3000" -ForegroundColor Cyan
}
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev:local
