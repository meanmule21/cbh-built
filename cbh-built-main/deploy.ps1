# Deployment Script for Vercel
# This script helps you deploy your changes to Vercel

Write-Host "🚀 Vercel Deployment Script" -ForegroundColor Cyan
Write-Host ""

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

# Check if Vercel CLI is available
$vercelAvailable = $false
$useNpx = $false

# Try to find Node.js and Vercel CLI
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodePath = "node"
    $vercelAvailable = $true
} elseif (Test-Path "C:\Program Files\nodejs\node.exe") {
    $nodePath = "C:\Program Files\nodejs\node.exe"
    $vercelAvailable = $true
} else {
    Write-Host "⚠ Node.js not found in PATH" -ForegroundColor Yellow
    Write-Host "Trying to use npx..." -ForegroundColor Yellow
    $useNpx = $true
}

if ($vercelAvailable -or $useNpx) {
    Write-Host "✓ Node.js found" -ForegroundColor Green
    
    # Check if already linked to Vercel
    if (Test-Path ".vercel\project.json") {
        Write-Host "✓ Project is linked to Vercel" -ForegroundColor Green
        Write-Host ""
        Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
        
        if ($useNpx) {
            & $nodePath -e "require('child_process').execSync('npx vercel --prod', {stdio: 'inherit', cwd: '$projectDir'})"
        } else {
            vercel --prod
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✓ Deployment successful!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "✗ Deployment failed" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ Project not linked to Vercel yet" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please run one of the following:" -ForegroundColor Cyan
        Write-Host "1. Run: .\setup-vercel.ps1 (to link and deploy)" -ForegroundColor White
        Write-Host "2. Or deploy via Vercel web interface:" -ForegroundColor White
        Write-Host "   - Go to https://vercel.com/new" -ForegroundColor White
        Write-Host "   - Import your GitHub repository" -ForegroundColor White
        Write-Host "   - Vercel will auto-deploy" -ForegroundColor White
    }
} else {
    Write-Host "✗ Cannot deploy: Node.js not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use the Vercel web interface instead:" -ForegroundColor Yellow
    Write-Host "1. Push your code to GitHub (if not already)" -ForegroundColor White
    Write-Host "2. Go to https://vercel.com/new" -ForegroundColor White
    Write-Host "3. Import your GitHub repository" -ForegroundColor White
    Write-Host "4. Vercel will auto-detect Next.js and deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "Or install Node.js from https://nodejs.org/ and try again" -ForegroundColor White
}
