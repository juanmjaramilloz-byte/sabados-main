# Start the Angular frontend from the frontend folder

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias del frontend..."
    npm install
}

Write-Host "Iniciando el frontend..."
npm start
