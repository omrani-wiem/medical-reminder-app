# Script de lancement de l'application Medical Reminder

Write-Host "🚀 Démarrage de l'application Medical Reminder..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si MongoDB est en cours d'exécution
Write-Host "📊 Vérification de MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($null -eq $mongoProcess) {
    Write-Host "⚠️  MongoDB ne semble pas être en cours d'exécution." -ForegroundColor Red
    Write-Host "   Assurez-vous que MongoDB est démarré avant de continuer." -ForegroundColor Red
    Write-Host ""
} else {
    Write-Host "✅ MongoDB est en cours d'exécution" -ForegroundColor Green
    Write-Host ""
}

# Démarrer le backend
Write-Host "🔧 Démarrage du backend Flask..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
$pythonExe = "C:/Program Files/Python311/python.exe"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; & '$pythonExe' app.py" -WindowStyle Normal

Write-Host "✅ Backend démarré sur http://localhost:5000" -ForegroundColor Green
Write-Host ""

# Attendre un peu que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend React..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm start" -WindowStyle Normal

Write-Host "✅ Frontend démarrera sur http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Application lancée avec succès!" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pour arrêter l'application, fermez les fenêtres PowerShell ou appuyez sur CTRL+C" -ForegroundColor Gray
