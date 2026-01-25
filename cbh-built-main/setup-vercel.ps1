# Vercel Setup Script
# This script will help you connect your project to Vercel

Write-Host "🚀 Setting up Vercel connection..." -ForegroundColor Cyan

# Check if Node.js is installed
$nodePath = $null
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodePath = "node"
    Write-Host "✓ Node.js found in PATH" -ForegroundColor Green
} elseif (Test-Path "C:\Program Files\nodejs\node.exe") {
    $nodePath = "C:\Program Files\nodejs\node.exe"
    Write-Host "✓ Node.js found at $nodePath" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
Write-Host "`nChecking for Vercel CLI..." -ForegroundColor Yellow
$vercelCheck = & $nodePath -e "try { require('vercel/package.json'); console.log('installed'); } catch(e) { console.log('not-installed'); }" 2>$null

if ($vercelCheck -ne "installed") {
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    & $nodePath -e "require('child_process').execSync('npm install -g vercel', {stdio: 'inherit'})"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install Vercel CLI. Trying with npx instead..." -ForegroundColor Yellow
        $useNpx = $true
    } else {
        $useNpx = $false
        Write-Host "✓ Vercel CLI installed successfully" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Vercel CLI already installed" -ForegroundColor Green
    $useNpx = $false
}

# Navigate to project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "`n📦 Project directory: $projectDir" -ForegroundColor Cyan

# Check if already linked
if (Test-Path ".vercel\project.json") {
    Write-Host "`n⚠ Project already linked to Vercel" -ForegroundColor Yellow
    $response = Read-Host "Do you want to re-link? (y/n)"
    if ($response -ne "y") {
        Write-Host "Skipping link step..." -ForegroundColor Yellow
        exit 0
    }
}

# Run vercel login (this will open browser)
Write-Host "`n🔐 Logging in to Vercel..." -ForegroundColor Cyan
Write-Host "This will open your browser for authentication." -ForegroundColor Yellow

if ($useNpx) {
    & $nodePath -e "require('child_process').execSync('npx vercel login', {stdio: 'inherit', cwd: '$projectDir'})"
} else {
    vercel login
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Login failed. Please try running 'vercel login' manually." -ForegroundColor Red
    exit 1
}

# Link project
Write-Host "`n🔗 Linking project to Vercel..." -ForegroundColor Cyan

if ($useNpx) {
    & $nodePath -e "require('child_process').execSync('npx vercel link', {stdio: 'inherit', cwd: '$projectDir'})"
} else {
    vercel link
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully connected to Vercel!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Add your environment variables in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Run 'vercel' to deploy, or 'vercel --prod' for production" -ForegroundColor White
} else {
    Write-Host "✗ Linking failed. Please try running 'vercel link' manually." -ForegroundColor Red
    exit 1
}
