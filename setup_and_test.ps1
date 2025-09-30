# Script PowerShell pour installer et tester Medical Reminder App

Write-Host "🚀 Installation et test de Medical Reminder App" -ForegroundColor Green

# Aller dans le dossier backend
Write-Host "`n📦 Installation des dépendances backend..." -ForegroundColor Yellow
Set-Location "backend"

# Installer les dépendances Python
pip install -r requirements.txt

# Retour au dossier principal
Set-Location ".."

# Aller dans le dossier frontend
Write-Host "`n📦 Installation des dépendances frontend..." -ForegroundColor Yellow
Set-Location "frontend"

# Installer les dépendances Node.js
npm install

# Retour au dossier principal
Set-Location ".."

Write-Host "`n✅ Installation terminée!" -ForegroundColor Green
Write-Host "`n📋 Instructions pour lancer l'application:" -ForegroundColor Cyan
Write-Host "1. Terminal 1 - Backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   python app.py" -ForegroundColor Gray
Write-Host "`n2. Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host "`n3. Ouvrir http://localhost:3000 dans votre navigateur" -ForegroundColor White

Write-Host "`n🔧 Configuration email:" -ForegroundColor Cyan
Write-Host "- Assurez-vous que votre mot de passe d'application Gmail est correct" -ForegroundColor Gray
Write-Host "- Utilisez le bouton 'Test Email' pour vérifier la configuration" -ForegroundColor Gray