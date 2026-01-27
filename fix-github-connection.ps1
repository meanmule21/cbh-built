# Fix GitHub Connection Script
# This script permanently fixes proxy and credential issues

Write-Host "=== GitHub Connection Fix ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear proxy environment variables for this session
Write-Host "Step 1: Clearing proxy environment variables..." -ForegroundColor Yellow
$env:HTTP_PROXY = $null
$env:HTTPS_PROXY = $null
$env:http_proxy = $null
$env:https_proxy = $null
$env:GIT_HTTP_PROXY = ""
$env:GIT_HTTPS_PROXY = ""
$env:NO_PROXY = "github.com,*.github.com"

# Step 2: Configure git to bypass proxy
Write-Host "Step 2: Configuring git to bypass proxy..." -ForegroundColor Yellow
git config --global --unset http.proxy
git config --global --unset https.proxy
git config --global http.https://github.com.proxy ""
git config --global http.proxy ""
git config --global https.proxy ""

# Step 3: Show current status
Write-Host "Step 3: Checking local commits..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Latest local commit:" -ForegroundColor Cyan
git log -1 --oneline
Write-Host ""
Write-Host "Files changed in latest commit:" -ForegroundColor Cyan
git show --stat --oneline HEAD | Select-Object -First 10
Write-Host ""

# Step 4: Test connection
Write-Host "Step 4: Testing GitHub connection..." -ForegroundColor Yellow
$testResult = git ls-remote origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host ""
    
    # Fetch to update remote tracking
    Write-Host "Fetching latest from GitHub..." -ForegroundColor Yellow
    git fetch origin 2>&1 | Out-Null
    
    # Check if local is ahead of remote
    $localCommit = git rev-parse HEAD
    $remoteCommit = git rev-parse origin/main 2>&1
    Write-Host ""
    Write-Host "Local commit:  $localCommit" -ForegroundColor Cyan
    Write-Host "Remote commit: $remoteCommit" -ForegroundColor Cyan
    Write-Host ""
    
    if ($localCommit -eq $remoteCommit) {
        Write-Host "Local and remote are in sync!" -ForegroundColor Green
        Write-Host ""
        Write-Host "If changes aren't showing on GitHub:" -ForegroundColor Yellow
        Write-Host "1. Hard refresh your browser (Ctrl+F5)" -ForegroundColor White
        Write-Host "2. Check you're viewing the 'main' branch" -ForegroundColor White
        Write-Host "3. Verify the commit hash matches: $localCommit" -ForegroundColor White
    }
    else {
        Write-Host "Step 5: Pushing to GitHub..." -ForegroundColor Yellow
        git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Verify on GitHub: https://github.com/meanmule21/cbh-built/commit/$localCommit" -ForegroundColor Cyan
        }
        else {
            Write-Host ""
            Write-Host "Push failed. The GitHub token might be expired." -ForegroundColor Red
            Write-Host "See GITHUB_CONNECTION_FIX.md for instructions to update your token." -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "Connection failed: $testResult" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your internet connection" -ForegroundColor White
    Write-Host "2. The GitHub token might be expired - see GITHUB_CONNECTION_FIX.md" -ForegroundColor White
    Write-Host "3. Try using SSH instead of HTTPS" -ForegroundColor White
}

Write-Host ""
Write-Host "Done" -ForegroundColor Cyan
