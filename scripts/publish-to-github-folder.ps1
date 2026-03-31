# Скопировать весь проект в C:\Users\N7\Documents\GitHub\mock-api-builder для GitHub.
# Запуск (Windows PowerShell):
#   powershell -ExecutionPolicy Bypass -File "\\wsl.localhost\Ubuntu\home\n7\Mock API Builder\scripts\publish-to-github-folder.ps1"

$ErrorActionPreference = "Stop"

$Dest = "C:\Users\N7\Documents\GitHub\mock-api-builder"
$WslProject = "\\wsl.localhost\Ubuntu\home\n7\Mock API Builder"

New-Item -ItemType Directory -Path $Dest -Force | Out-Null

Write-Host "Копирование проекта в:`n  $Dest`nиз:`n  $WslProject"

robocopy $WslProject $Dest /E `
  /XD node_modules .venv venv __pycache__ .pytest_cache .mypy_cache .ruff_cache dist .vite .git .idea .vscode `
  /XF .env `
  /NFL /NDL /NJH /NJS /nc /ns /np

if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy завершился с кодом $LASTEXITCODE"
}

$assets = "$env:USERPROFILE\.cursor\projects\wsl-localhost-Ubuntu-home-n7-Mock-API-Builder\assets"
$shots = Join-Path $Dest "docs\screenshots"
New-Item -ItemType Directory -Path $shots -Force | Out-Null

$dash = Join-Path $assets "c__Users_N7_AppData_Roaming_Cursor_User_workspaceStorage_78f1c9c14bf388c352455829954f7a12_images_image-877d9ca4-0e1e-413a-9e4b-f73f5494f298.png"
$swag = Join-Path $assets "c__Users_N7_AppData_Roaming_Cursor_User_workspaceStorage_78f1c9c14bf388c352455829954f7a12_images_image-963e785b-9313-4fde-b75b-c76807017b08.png"

if (Test-Path $dash) { Copy-Item $dash (Join-Path $shots "dashboard.png") -Force; Write-Host "OK: dashboard.png" }
else { Write-Warning "Не найден файл скрина dashboard: $dash" }

if (Test-Path $swag) { Copy-Item $swag (Join-Path $shots "swagger.png") -Force; Write-Host "OK: swagger.png" }
else { Write-Warning "Не найден файл скрина swagger: $swag" }

Push-Location $Dest
if (-not (Test-Path ".git")) {
    git init
    Write-Host "git init выполнен."
}
Pop-Location

Write-Host "`nГотово. Проверка:"
Write-Host "  dir `"$Dest`""
Write-Host "  dir `"$shots`""
