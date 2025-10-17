# 🏥 Medical Reminder App - Application de Rappel Médical

Application web complète de gestion de médicaments avec rappels automatiques et support multilingue (Français, English, العربية التونسية).

## 📋 Table des matières
- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Sécurité](#-sécurité)
- [Support multilingue](#-support-multilingue)

## 🎯 Présentation

Medical Reminder est une application web qui aide les patients à gérer leurs médicaments, leurs rappels de prise et à suivre leur adhérence au traitement.

**Fonctionnalités principales :**
- 💊 Gestion complète des médicaments
- ⏰ Rappels automatiques par email
- 📊 Statistiques et analyses d'adhérence
- 📅 Calendrier des prises
- 🌍 Support trilingue (FR, EN, AR tunisien)
- 🔐 Authentification sécurisée
- 📧 Récupération de mot de passe

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription / Connexion sécurisée
- Mot de passe oublié avec code par email
- Changement de mot de passe
- Hash SHA-256 des mots de passe

### 💊 Gestion des médicaments
- Ajout/modification/suppression de médicaments
- Informations détaillées (dosage, forme, fréquence)
- Gestion du stock (alerte stock bas)
- Instructions de prise personnalisées
- Médecin prescripteur

### ⏰ Rappels intelligents
- Configuration des heures de prise
- Rappels par email automatiques
- Activation/désactivation par médicament
- Suivi des prises (prises/manquées)

### 📊 Statistiques et analyses
- Taux d'adhérence global et par période
- Évolution temporelle
- Graphiques interactifs (Chart.js + Recharts)
- Identification des meilleurs/pires jours
- Recommandations personnalisées

### 📅 Calendrier
- Vue jour/semaine/mois
- Historique complet des prises
- Filtres avancés (statut, période, dates)
- Export CSV/PDF

### ⚙️ Paramètres
- Profil utilisateur personnalisable
- Changement de langue en temps réel
- Support RTL pour l'arabe
- Gestion des notifications

## 🛠️ Technologies

### Frontend
- **React 18.x** - Interface utilisateur
- **React Router** - Navigation
- **i18next** - Internationalisation (FR, EN, AR)
- **Chart.js & Recharts** - Graphiques
- **CSS3** - Styling responsive

### Backend
- **Flask 3.1.2** - Framework web Python
- **MongoDB** - Base de données NoSQL
- **Flask-Mail** - Envoi d'emails
- **APScheduler** - Tâches planifiées
- **python-dotenv** - Variables d'environnement
- **Flask-CORS** - Gestion CORS

## 📦 Installation

### Prérequis
- **Node.js** 16+ et npm
- **Python** 3.11+
- **MongoDB** (local ou cloud)
- Compte **Gmail** avec "Mot de passe d'application"

### 1. Cloner le repository
```bash
git clone https://github.com/Fridhi-Rochdi/rminderapp.git
cd rminderapp
```

### 2. Installation Backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Installation Frontend

```bash
cd ../frontend
npm install
```

## 🔧 Configuration

### Backend - Variables d'environnement

1. **Créer le fichier `.env`** dans `backend/`
```bash
cd backend
copy env.example .env
```

2. **Remplir `.env`** avec vos vraies valeurs :

```env
# Flask
FLASK_SECRET_KEY=votre_cle_secrete_ultra_securisee
FLASK_ENV=development
FLASK_DEBUG=True

# MongoDB
MONGO_URI=mongodb://localhost:27017/medical_reminder
MONGO_DB_NAME=medical_reminder

# Gmail SMTP
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_DEFAULT_SENDER_NAME=Medical Reminder App
MAIL_DEFAULT_SENDER_EMAIL=votre.email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Tokens
TOKEN_EXPIRATION_HOURS=24
RESET_CODE_EXPIRATION_MINUTES=15
```

### ⚠️ Configuration Gmail SMTP

Pour Gmail, créez un **"Mot de passe d'application"** :

1. Allez sur https://myaccount.google.com/
2. **Sécurité** → **Validation en deux étapes** (activez-la)
3. **Sécurité** → **Mots de passe des applications**
4. Créez un mot de passe pour "Medical Reminder App"
5. Copiez le mot de passe généré (format : `xxxx xxxx xxxx xxxx`)
6. Collez-le dans `MAIL_PASSWORD`

## 🚀 Utilisation

### Démarrer MongoDB

```bash
# Windows (si installé en tant que service)
net start MongoDB

# Ou démarrez MongoDB manuellement
mongod
```

### Démarrer le Backend

```bash
cd backend
python app.py
```
🌐 Backend disponible sur : **http://localhost:5000**

### Démarrer le Frontend

```bash
cd frontend
npm start
```
🌐 Frontend disponible sur : **http://localhost:3000**

## 🔒 Sécurité

### Fichiers sensibles (JAMAIS commit sur Git)
- ✅ `backend/.env` - Contient les mots de passe et tokens
- ✅ `backend/venv/` - Environnement virtuel Python
- ✅ `frontend/node_modules/` - Dépendances Node.js

### Fichiers safe pour Git
- ✅ `backend/env.example` - Template sans données sensibles
- ✅ `backend/.gitignore` - Configuration d'exclusion Git
- ✅ `frontend/.gitignore` - Configuration d'exclusion Git

### Bonnes pratiques
- 🔐 Mots de passe hashés (SHA-256)
- 🔑 Codes de réinitialisation à usage unique
- ⏱️ Expiration automatique des codes (15 min)
- 🚫 CORS configuré pour le frontend uniquement
- 📧 "Mot de passe d'application" Gmail (pas le mot de passe principal)

## 🌍 Support multilingue

### Langues supportées
- 🇫🇷 **Français** (langue par défaut)
- 🇬🇧 **English**
- 🇸🇦 **العربية** (Dialecte tunisien avec support RTL)

### Changement de langue
1. Aller dans **Paramètres** (⚙️)
2. Section "Langue de l'application"
3. Cliquer sur le drapeau de la langue souhaitée

### Support RTL (Right-to-Left)
L'interface s'adapte automatiquement pour l'arabe :
- Texte de droite à gauche
- Navigation inversée
- Disposition miroir

## 📁 Structure du projet

```
rminderapp/
├── backend/
│   ├── app.py                    # Application Flask
│   ├── requirements.txt          # Dépendances Python
│   ├── .env                      # Variables d'environnement (local)
│   ├── env.example              # Template de configuration
│   ├── .gitignore               # Exclusions Git
│   └── README.md                # Documentation backend
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── Medicine.json
│   ├── src/
│   │   ├── components/          # Composants React
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── MesMedicaments.js
│   │   │   ├── Rappels.js
│   │   │   ├── Calendrier.js
│   │   │   ├── Historique.js
│   │   │   ├── Statistiques.js
│   │   │   ├── Parametres.js
│   │   │   └── LanguageSwitcher.js
│   │   ├── locales/             # Fichiers de traduction
│   │   │   ├── fr.json          # Français
│   │   │   ├── en.json          # English
│   │   │   └── ar.json          # العربية (tunisien)
│   │   ├── i18n.js              # Configuration i18n
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md                     # Ce fichier
```

## 🗄️ Base de données MongoDB

### Collections

#### `users`
- Informations utilisateurs
- Mots de passe hashés
- Codes de réinitialisation temporaires

#### `medicaments`
- Liste des médicaments par utilisateur
- Dosage, fréquence, stock
- Instructions de prise

#### `settings`
- Préférences utilisateur
- Langue, notifications
- Informations médicales

## 📧 Endpoints API

### Authentication
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `POST /auth/forgot-password` - Demander un code
- `POST /auth/reset-password` - Réinitialiser
- `POST /auth/change-password` - Changer

### Medications
- `GET /medicaments?email=...` - Liste
- `POST /medicaments` - Ajouter

### Settings
- `GET /settings?email=...` - Récupérer
- `PUT /settings` - Sauvegarder

## 👥 Auteurs

- **Wiem Omrani** - Développement
- **Fridhi Rochdi** - Maintenance

## 📝 License

Ce projet est à usage éducatif.

## 🐛 Problèmes connus

### Backend ne démarre pas
- ✅ Vérifiez que MongoDB est démarré
- ✅ Vérifiez `.env` est présent et rempli
- ✅ Vérifiez `python-dotenv` est installé

### Emails non reçus
- ✅ Vérifiez le mot de passe d'application Gmail
- ✅ Vérifiez les spams
- ✅ Testez avec `voir_code_reset.py`

### Erreur CORS
- ✅ Vérifiez `FRONTEND_URL` dans `.env`
- ✅ Vérifiez le frontend tourne sur port 3000

## 🎉 Remerciements

Merci d'utiliser Medical Reminder ! 🏥💊

Pour toute question : omraniwiem62@gmail.com
