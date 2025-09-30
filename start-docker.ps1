# 🚀 Script PowerShell pour lancer Docker sur Windows

Write-Host "🐳 Démarrage de Medical Reminder App avec Docker..." -ForegroundColor Cyan

# Nettoyer les anciens containers
Write-Host "🧹 Nettoyage des anciens containers..." -ForegroundColor Yellow
docker-compose down

# Construire et démarrer tous les services
Write-Host "🏗️  Construction et démarrage des services..." -ForegroundColor Green
docker-compose up --build

# Pour démarrer en arrière-plan :
# docker-compose up --build -d