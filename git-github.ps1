# Git GitHub Helper Script
# This script sets NO_PROXY to bypass proxy issues when working with GitHub
# Usage: .\git-github.ps1 <git-command>
# Example: .\git-github.ps1 "fetch origin"
# Example: .\git-github.ps1 "push origin main"

param(
    [Parameter(Mandatory=$true)]
    [string]$GitCommand
)

# Set NO_PROXY to bypass proxy for GitHub
$env:NO_PROXY = "github.com,*.github.com,*.githubusercontent.com"

# Configure git to not use proxy for GitHub
git config --global http.https://github.com.proxy ""

# Execute the git command
Write-Host "Executing: git $GitCommand" -ForegroundColor Cyan
Invoke-Expression "git $GitCommand"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Git command completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Git command failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}
