#!/bin/bash
# 🚀 Script de lancement Docker pour Medical Reminder App

echo "🐳 Démarrage de Medical Reminder App avec Docker..."

# Nettoyer les anciens containers (optionnel)
echo "🧹 Nettoyage des anciens containers..."
docker-compose down

# Construire et démarrer tous les services
echo "🏗️  Construction et démarrage des services..."
docker-compose up --build

# Si vous voulez démarrer en arrière-plan, utilisez :
# docker-compose up --build -d