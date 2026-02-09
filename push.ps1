# Push to remote (GitHub) from project root
# Usage: .\push.ps1
# Optional: .\push.ps1 -Message "Your commit message"

param(
    [string]$Message = "Update"
)

Set-Location $PSScriptRoot

git add -A
$status = git status --short
if (-not $status) {
    Write-Host "Nothing to commit. Already up to date."
    git push origin main
    exit 0
}

git commit -m $Message
git push origin main
Write-Host "Pushed to origin main."
