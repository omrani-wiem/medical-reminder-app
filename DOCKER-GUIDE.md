# 🐳 Guide Docker - Medical Reminder App

## 📋 Pré-requis

### 1. Installer Docker Desktop
- **Windows/Mac :** https://www.docker.com/products/docker-desktop
- **Linux :** `sudo apt install docker.io docker-compose`

### 2. Vérifier l'installation
```bash
docker --version
docker-compose --version
```

## 🚀 Lancement rapide

### Option 1: Commande simple
```bash
docker-compose up --build
```

### Option 2: Avec nos scripts
```bash
# Linux/Mac
./start-docker.sh

# Windows PowerShell
.\start-docker.ps1
```

## 🌐 Accès aux services

Une fois lancé, accédez à :
- **Frontend React :** http://localhost:3000
- **Backend API :** http://localhost:5000  
- **MongoDB :** localhost:27017

## 🛠️ Commandes utiles

```bash
# Voir les containers en cours
docker ps

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart backend

# Supprimer tout (containers + volumes)
docker-compose down -v
```

## 🔧 Variables d'environnement

Éditez le fichier `.env` pour personnaliser :
- JWT_SECRET_KEY
- EMAIL_PASSWORD  
- MONGO_URI

## 🐛 Résolution de problèmes

### Port déjà utilisé
```bash
# Trouver qui utilise le port 3000
netstat -tulpn | grep 3000

# Ou changer le port dans docker-compose.yml
ports:
  - "3001:3000"  # Port externe:interne
```

### Problème de permissions
```bash
# Linux/Mac
sudo docker-compose up --build
```

### Nettoyer complètement
```bash
docker system prune -a
docker volume prune
```

## 📊 Architecture Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    MongoDB      │
│   (React)       │    │   (Flask)       │    │   (Database)    │
│   Port: 3000    │◄──►│   Port: 5000    │◄──►│   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                     ┌─────────────────┐
                     │  medical_network │
                     │   (Docker)       │ 
                     └─────────────────┘
```

## ✅ Avantages de cette configuration

- 🚀 **Démarrage en 1 commande**
- 🔒 **Environnement isolé et sécurisé**  
- 📦 **Toutes les dépendances incluses**
- 🌍 **Fonctionne sur Windows/Mac/Linux**
- 🔄 **Persistance des données MongoDB**
- 🛡️ **Réseau Docker isolé**