# Copy project to a local GitHub folder (excludes secrets and heavy dirs).
# Run from Windows PowerShell:  powershell -ExecutionPolicy Bypass -File .\scripts\copy-to-github.ps1
# Optional:  -Destination "C:\Users\YOU\Documents\GitHub\my-repo"

param(
    [string]$Destination = "$env:USERPROFILE\Documents\GitHub\mock-api-builder"
)

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path $here)) {
    Write-Error "Source not found: $here"
}

New-Item -ItemType Directory -Path $Destination -Force | Out-Null

Write-Host "Copying from:`n  $here`nto:`n  $Destination"

robocopy $here $Destination /E `
  /XD node_modules .venv venv __pycache__ .pytest_cache .mypy_cache .ruff_cache dist .vite .git .idea .vscode `
  /XF .env `
  /NFL /NDL /NJH /NJS /nc /ns /np

$code = $LASTEXITCODE
if ($code -ge 8) {
    Write-Error "robocopy failed with exit code $code"
}

Push-Location $Destination
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Initialized git in $Destination"
}
else {
    Write-Host "Git already initialized."
}
Pop-Location

Write-Host "Done. Next: cd '$Destination'; git add -A; git status"
