# Fix NPM Proxy Issue Permanently

The proxy issue is caused by system-level environment variables. Here's how to fix it permanently:

## Quick Fix (Run in PowerShell)

Run this script before using npm:

```powershell
cd c:\Users\injec\Downloads\cbh-built-main\cbh-built-main
.\fix-npm-proxy.ps1
```

## Permanent Fix (Recommended)

### Option 1: Remove System Environment Variables

1. Press `Win + R`
2. Type `sysdm.cpl` and press Enter
3. Click **"Advanced"** tab
4. Click **"Environment Variables"**
5. Under **"User variables"** or **"System variables"**, find and **DELETE**:
   - `HTTP_PROXY`
   - `HTTPS_PROXY`
   - `http_proxy`
   - `https_proxy`
   - `NPM_CONFIG_OFFLINE` (if present)
6. Click **OK** on all dialogs
7. **Restart PowerShell** (close and reopen)
8. Test: `npm ping`

### Option 2: Use the Fix Script

The `fix-npm-proxy.ps1` script will:
- Clear proxy environment variables for the current session
- Configure npm to not use proxy
- Create a `.npmrc` file to override settings

**Run it before any npm commands:**
```powershell
.\fix-npm-proxy.ps1
```

### Option 3: Add to PowerShell Profile

Add this to your PowerShell profile so it runs automatically:

```powershell
# Edit profile
notepad $PROFILE

# Add these lines:
$env:HTTP_PROXY = $null
$env:HTTPS_PROXY = $null
$env:http_proxy = $null
$env:https_proxy = $null
$env:NPM_CONFIG_OFFLINE = "false"
```

## Verify It's Fixed

```powershell
npm ping
# Should see: "PONG" with a time (e.g., "PONG 299ms")
```

## Current Status

✅ **`.npmrc` file created** - Overrides proxy settings in this project  
✅ **Fix script created** - `fix-npm-proxy.ps1`  
⏳ **System variables** - Need to be removed for permanent fix
