# Helper script to run npm commands with proxy disabled
# Usage: .\use-npm.ps1 install
#        .\use-npm.ps1 run build
#        .\use-npm.ps1 ping

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$npmArgs
)

# Clear proxy environment variables
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""
$env:NPM_CONFIG_OFFLINE = "false"
$env:NPM_CONFIG_PREFER_OFFLINE = "false"
$env:NPM_CONFIG_PROXY = ""
$env:NPM_CONFIG_HTTPS_PROXY = ""

# Run npm with the provided arguments
npm @npmArgs
