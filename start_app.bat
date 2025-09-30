@echo off
echo 🚀 Lancement de Medical Reminder App
echo.

echo 📦 Démarrage du backend...
start "Backend Flask" cmd /c "cd backend && python app.py"

timeout /t 3 /nobreak > nul

echo 📦 Démarrage du frontend...
start "Frontend React" cmd /c "cd frontend && npm start"

echo.
echo ✅ Application en cours de démarrage...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo Appuyez sur une touche pour continuer...
pause > nul
