# Setup SSH and Push to GitHub
# This script helps you set up SSH authentication for GitHub

Write-Host "GitHub SSH Setup" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan

# Check for existing SSH keys
$sshKeyPath = "$env:USERPROFILE\.ssh\id_ed25519.pub"
if (-not (Test-Path $sshKeyPath)) {
    $sshKeyPath = "$env:USERPROFILE\.ssh\id_rsa.pub"
}

if (Test-Path $sshKeyPath) {
    Write-Host "`n✅ Found SSH key: $sshKeyPath" -ForegroundColor Green
    Write-Host "`nYour public SSH key:" -ForegroundColor Yellow
    Get-Content $sshKeyPath
    Write-Host "`n📋 Copy the key above and add it to GitHub:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://github.com/settings/keys" -ForegroundColor White
    Write-Host "   2. Click 'New SSH key'" -ForegroundColor White
    Write-Host "   3. Paste the key and save" -ForegroundColor White
    Write-Host "`nPress Enter after adding the key to GitHub..." -ForegroundColor Yellow
    Read-Host
    
    # Switch to SSH
    Write-Host "`nSwitching remote to SSH..." -ForegroundColor Yellow
    cd c:\Users\injec\Downloads\cbh-built-main
    git remote set-url origin git@github.com:meanmule21/cbh-built.git
    
    Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
    $env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Push failed. Make sure the SSH key is added to GitHub." -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  No SSH key found. Generating one..." -ForegroundColor Yellow
    Write-Host "`nThis will create a new SSH key. Press Enter to continue..." -ForegroundColor Yellow
    Read-Host
    
    ssh-keygen -t ed25519 -C "github-push" -f "$env:USERPROFILE\.ssh\id_ed25519" -N '""'
    
    if (Test-Path "$env:USERPROFILE\.ssh\id_ed25519.pub") {
        Write-Host "`n✅ SSH key generated!" -ForegroundColor Green
        Write-Host "`nYour public SSH key:" -ForegroundColor Yellow
        Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
        Write-Host "`n📋 Copy the key above and add it to GitHub:" -ForegroundColor Cyan
        Write-Host "   1. Go to: https://github.com/settings/keys" -ForegroundColor White
        Write-Host "   2. Click 'New SSH key'" -ForegroundColor White
        Write-Host "   3. Paste the key and save" -ForegroundColor White
        Write-Host "`nAfter adding the key, run this script again to push." -ForegroundColor Yellow
    }
}
