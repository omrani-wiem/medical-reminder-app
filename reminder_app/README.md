<<<<<<< HEAD
#  Medical Reminder App
=======
#  Medical Reminder App - Application de Rappel Médical
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

<div align="center">

<<<<<<< HEAD
![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Python](https://img.shields.io/badge/Python-3.11+-green?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1.2-lightgrey?logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, full-stack web application that helps patients manage their medications and medication adherence through automated reminders, intake tracking, and comprehensive analytics.
=======
##  Table des matières
- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Sécurité](#-sécurité)
- [Support multilingue](#-support-multilingue)

##  Présentation
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

<<<<<<< HEAD
</div>

---

##  Overview

**Medical Reminder App** is a comprehensive solution for medication management and adherence tracking. Users can:

-  Register, manage medication profiles, and set intake schedules
-  Receive personalized email reminders at scheduled times  
-  Track adherence with detailed statistics and analytics
-  View intake history with advanced filtering options
-  Access the app in French, English, or Arabic (with RTL support)
-  Enjoy secure authentication with password reset functionality

Perfect for patients managing chronic conditions, caregivers tracking multiple users, and healthcare providers monitoring patient compliance.

##  Features

###  **Authentication & Security**
- User registration with email validation
- Secure login with JWT token management
- Password hashing (SHA-256 encryption)
- Forgot password with email-based reset codes
- Time-limited password reset tokens (30-minute expiry)
- Secure session management

###  **Medication Management**
- Create, edit, and delete medication profiles
- Track dosage, drug form, and intake frequency
- Store prescriber and doctor information
- Set low stock alerts and reorder reminders
- Add custom medication instructions and notes
- Comprehensive medication history
=======
**Fonctionnalités principales :**
-  Gestion complète des médicaments
-  Rappels automatiques par email
-  Statistiques et analyses d'adhérence
-  Calendrier des prises
-  Support trilingue (FR, EN, AR tunisien)
-  Authentification sécurisée
-  Récupération de mot de passe

##  Fonctionnalités

###  Authentification
- Inscription / Connexion sécurisée
- Mot de passe oublié avec code par email
- Changement de mot de passe
- Hash SHA-256 des mots de passe

###  Gestion des médicaments
- Ajout/modification/suppression de médicaments
- Informations détaillées (dosage, forme, fréquence)
- Gestion du stock (alerte stock bas)
- Instructions de prise personnalisées
- Médecin prescripteur

###  Rappels intelligents
- Configuration des heures de prise
- Rappels par email automatiques
- Activation/désactivation par médicament
- Suivi des prises (prises/manquées)

###  Statistiques et analyses
- Taux d'adhérence global et par période
- Évolution temporelle
- Graphiques interactifs (Chart.js + Recharts)
- Identification des meilleurs/pires jours
- Recommandations personnalisées

###  Calendrier
- Vue jour/semaine/mois
- Historique complet des prises
- Filtres avancés (statut, période, dates)
- Export CSV/PDF

###  Paramètres
- Profil utilisateur personnalisable
- Changement de langue en temps réel
- Support RTL pour l'arabe
- Gestion des notifications

##  Technologies
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

###  **Smart Reminder System**
- Configurable intake times for each medication
- Automated email reminders via SMTP
- Individual reminder enable/disable control
- Real-time notification preferences
- Scheduled background tasks (APScheduler)
- Flexible reminder frequency (daily, weekly, custom)

###  **Analytics & Statistics**
- Overall medication adherence rates
- Time-based compliance tracking
- Interactive charts and visualizations
- Best/worst performance analysis
- Personalized health insights and recommendations
- Data export capabilities

<<<<<<< HEAD
###  **Calendar & History**
- Multi-view calendar (day/week/month)
- Complete intake history repository
- Advanced filtering (by medication, date range, status)
- Detailed intake records with timestamps
- Adherence status visualization
- Historical data analysis
=======
##  Installation
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

###  **User Settings & Preferences**
- User profile customization
- Real-time language switching (FR/EN/AR)
- Right-to-left (RTL) support for Arabic
- Notification management preferences
- Personal health information storage

###  **Multi-Language Support**
- **Français (FR)** - Complete French interface
- **English (EN)** - Full English translation
- **العربية (AR)** - Tunisian Arabic with RTL layout
- Language auto-detection from browser settings
- Persistent language preference in localStorage

---

##  Tech Stack

### **Frontend**
- **React 19.1.1** - Modern UI library with hooks
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing
- **i18next 25.6.0** - Internationalization (i18n)
- **Chart.js & Recharts 3.3.0** - Data visualization
- **React Icons 5.5.0** - Icon library
- **Lottie React 2.4.1** - Smooth animations

### **Backend**
- **Flask 3.1.2** - Lightweight Python web framework
- **MongoDB 6** - NoSQL database for flexible data storage
- **Flask-Mail 0.10.0** - Email sending (SMTP integration)
- **APScheduler 3.11.0** - Background task scheduling
- **Flask-CORS 6.0.1** - Cross-origin resource sharing
- **python-dotenv 1.0.1** - Environment variable management

### **Infrastructure**
- **Docker & Docker Compose** - Containerization and orchestration
- **REST API** - RESTful API design pattern

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **MongoDB** 6+ (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Gmail account** with "App Password" for email functionality
- **Docker** (optional, for containerized setup)

### Quick Start - Option 1: Docker (Recommended)

The easiest way to get up and running:

```bash
# Clone the repository
git clone <your-repo-url>
cd reminder_app

# Start all services with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

Docker Compose will automatically:
- Start MongoDB container
- Build and run the Flask backend
- Build and run the React frontend
- Set up network communication between services

### Quick Start - Option 2: Local Development

**Step 1: Backend Setup**

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with configuration
echo FLASK_SECRET_KEY=your_secret_key_here > .env
echo FLASK_ENV=development >> .env
echo MONGO_URI=mongodb://localhost:27017/medical_reminder >> .env
echo MAIL_SERVER=smtp.gmail.com >> .env
echo MAIL_PORT=587 >> .env
echo MAIL_USERNAME=your.email@gmail.com >> .env
echo MAIL_PASSWORD=your_app_password >> .env

<<<<<<< HEAD
# Run the backend
=======
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

###  Configuration Gmail SMTP

Pour Gmail, créez un **"Mot de passe d'application"** :

1. Allez sur https://myaccount.google.com/
2. **Sécurité** → **Validation en deux étapes** (activez-la)
3. **Sécurité** → **Mots de passe des applications**
4. Créez un mot de passe pour "Medical Reminder App"
5. Copiez le mot de passe généré (format : `xxxx xxxx xxxx xxxx`)
6. Collez-le dans `MAIL_PASSWORD`

##  Utilisation

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
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3
python app.py
# Server will be available at http://localhost:5000
```
<<<<<<< HEAD
=======
 Backend disponible sur : **http://localhost:5000**
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

**Step 2: Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Server will be available at http://localhost:5173 (or configured port)
```
<<<<<<< HEAD

### Quick Start - Option 3: PowerShell Script (Windows Only)

For Windows users, use the provided PowerShell script:

```powershell
.\start-app.ps1
```

This script will automatically:
- Start MongoDB service (if installed locally)
- Start the Flask backend in a new PowerShell window
- Start the React frontend in another new PowerShell window

---
=======
 Frontend disponible sur : **http://localhost:3000**

##  Sécurité

### Fichiers sensibles (JAMAIS commit sur Git)
-  `backend/.env` - Contient les mots de passe et tokens
-  `backend/venv/` - Environnement virtuel Python
-  `frontend/node_modules/` - Dépendances Node.js

### Fichiers safe pour Git
-  `backend/env.example` - Template sans données sensibles
-  `backend/.gitignore` - Configuration d'exclusion Git
-  `frontend/.gitignore` - Configuration d'exclusion Git

### Bonnes pratiques
-  Mots de passe hashés (SHA-256)
-  Codes de réinitialisation à usage unique
-  Expiration automatique des codes (15 min)
-  CORS configuré pour le frontend uniquement
-  "Mot de passe d'application" Gmail (pas le mot de passe principal)

##  Support multilingue
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

##  Environment Configuration

<<<<<<< HEAD
Create a `.env` file in the `backend/` directory:
=======
### Changement de langue
1. Aller dans **Paramètres** ()
2. Section "Langue de l'application"
3. Cliquer sur le drapeau de la langue souhaitée
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

```env
# Flask Configuration
FLASK_SECRET_KEY=your_very_secure_secret_key_here
FLASK_ENV=development
FLASK_APP=app.py

<<<<<<< HEAD
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/medical_reminder
MONGO_DB_NAME=medical_reminder

# Email Configuration (Gmail SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your.email@gmail.com
MAIL_PASSWORD=your_app_password  # Use Gmail App Password, not your regular password
MAIL_DEFAULT_SENDER_EMAIL=your.email@gmail.com

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Token Configuration
TOKEN_EXPIRATION_HOURS=24
RESET_CODE_EXPIRATION_MINUTES=30

# APScheduler Configuration
SCHEDULER_TIMEZONE=UTC
SCHEDULER_MISFIRE_GRACE_TIME=300
```

### Setting Up Gmail App Password

1. Go to your [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Create an "App Password" for Mail
4. Use the generated password in `MAIL_PASSWORD`

---

## � Available Scripts

### Frontend Scripts

```bash
cd frontend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run linting (ESLint)
npm run lint

# Preview production build locally
npm run preview

# Run tests
npm test
```

### Backend Scripts

```bash
cd backend

# Run the Flask development server
python app.py

# Run with automatic reload on file changes
FLASK_ENV=development python app.py
```

---

##  Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild without cache
docker-compose build --no-cache

# Remove volumes (database data)
docker-compose down -v
```

---

## � API Endpoints

### Authentication
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login user
POST   /auth/forgot-password    - Request password reset code
POST   /auth/reset-password     - Reset password with code
```

### Medications
```
GET    /medications             - Fetch all user medications
POST   /medications             - Create new medication
PUT    /medications/<id>        - Update medication
DELETE /medications/<id>        - Delete medication
```

### Reminders
```
GET    /reminders               - Fetch user's reminders
POST   /reminders               - Create reminder
PUT    /reminders/<id>          - Update reminder
DELETE /reminders/<id>          - Delete reminder
```

### History & Statistics
```
GET    /history                 - Get intake history
GET    /statistics              - Get adherence analytics
POST   /history                 - Log medication intake
```

---

## 📁 Project Structure
=======
##  Structure du projet
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

```
reminder_app/
│
├── 📂 backend/
│   ├── app.py                 # Flask application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── dockerfile             # Backend container configuration
│   ├── README.md              # Backend-specific documentation
│   └── [Other Python modules]
│
├── 📂 frontend/
│   ├── src/
│   │   ├── App.js            # Main application component
│   │   ├── App.css           # Global styles
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global CSS
│   │   ├── i18n.js           # i18next configuration
│   │   ├── config.js         # Application configuration
│   │   │
│   │   ├── 📂 components/    # Reusable React components
│   │   │   ├── Login.js      # Authentication page
│   │   │   ├── Register.js   # User registration
│   │   │   ├── Dashboard.js  # Main dashboard layout
│   │   │   ├── AccueilDashboard.js    # Home/Welcome section
│   │   │   ├── MesMedicaments.js      # Medication management
│   │   │   ├── Rappels.js            # Reminders configuration
│   │   │   ├── Historique.js         # Intake history
│   │   │   ├── Statistiques.js       # Analytics & charts
│   │   │   ├── Calendrier.js         # Calendar view
│   │   │   ├── Parametres.js         # User settings
│   │   │   ├── LanguageSwitcher.js   # Language toggle
│   │   │   ├── ForgotPassword.js     # Password recovery
│   │   │   └── ResetPassword.js      # Password reset
│   │   │
│   │   ├── 📂 assets/        # Images, icons, media files
│   │   │
│   │   └── 📂 locales/       # Translation files
│   │       ├── fr.json       # French translations
│   │       ├── fr_COMPLETE.json
│   │       ├── en.json       # English translations
│   │       └── ar.json       # Arabic translations
│   │
│   ├── package.json          # npm dependencies and scripts
│   ├── vite.config.js        # Vite build configuration
│   ├── eslint.config.js      # ESLint code quality rules
│   ├── index.html            # HTML entry point
│   ├── dockerfile            # Frontend container configuration
│   └── README.md             # Frontend-specific documentation
│
├── docker-compose.yml        # Docker Compose orchestration
├── start-app.ps1            # PowerShell startup script (Windows)
└── README.md                # This file!
```

<<<<<<< HEAD
---
=======
##  Base de données MongoDB
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

## 🔐 Security Features

- **Password Hashing**: SHA-256 encryption for all passwords
- **Token Management**: JWT-like tokens with expiration
- **CORS Protection**: Configured CORS for safe cross-origin requests
- **Environment Variables**: Sensitive data stored in `.env`
- **Email Verification**: Reset codes expire after 30 minutes
- **Session Management**: Secure login sessions with localStorage tokens

---

## 🧪 Testing

<<<<<<< HEAD
The project includes test files for quality assurance:
- `frontend/src/App.test.js` - Main component tests
- `frontend/src/App.test.simple.js` - Simple test examples
- `frontend/src/TestHome.js` - Home component tests

Run tests with:
```bash
cd frontend
npm test
```

---

## 📖 Documentation

- [Backend Documentation](backend/README.md) - Detailed backend setup and API documentation
- [Frontend Documentation](frontend/README.md) - Frontend architecture and component guide

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with a clear description of your changes

### Code Style

- Follow JavaScript/React conventions (use Prettier if configured)
- Follow Python PEP 8 style guide
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your code before submitting PR

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env` matches your setup
- For MongoDB Atlas, ensure IP whitelist includes your address

### Email Not Sending
- Verify Gmail App Password (not regular password) is used
- Enable "Less secure app access" if not using App Password
- Check `MAIL_SERVER` and `MAIL_PORT` settings
- Ensure `MAIL_USERNAME` matches the email sending from

### Frontend Port Already in Use
- Change port in `vite.config.js`: `{ server: { port: 3001 } }`
- Or kill the process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

### Docker Issues
- Rebuild without cache: `docker-compose build --no-cache`
- Remove old volumes: `docker-compose down -v`
- Check logs: `docker-compose logs -f`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

- **Developer**: Created with ❤️ for medication adherence

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an [Issue](../../issues) on GitHub
- Create a [Discussion](../../discussions) for questions
- Check existing documentation for common problems

---

## 🙏 Acknowledgments

- React and Vite communities
- Flask and Python communities
- MongoDB for reliable data storage
- i18next for translation support
- All contributors and users who help improve this project

---

<div align="center">

### Made with ❤️ for better medication adherence

[⬆ Back to top](#-medical-reminder-app)

</div>
=======
##  Endpoints API
>>>>>>> b77611a2b70201213a4e5290f18dd7d2733c8ab3

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

##  Auteurs

- **Wiem Omrani** - Développement
- **Fridhi Rochdi** - Maintenance

##  License

Ce projet est à usage éducatif.

##  Problèmes connus

### Backend ne démarre pas
-  Vérifiez que MongoDB est démarré
-  Vérifiez `.env` est présent et rempli
-  Vérifiez `python-dotenv` est installé

### Emails non reçus
-  Vérifiez le mot de passe d'application Gmail
-  Vérifiez les spams
-  Testez avec `voir_code_reset.py`

### Erreur CORS
-  Vérifiez `FRONTEND_URL` dans `.env`
-  Vérifiez le frontend tourne sur port 3000

## 🎉 Remerciements

Merci d'utiliser Medical Reminder ! 🏥💊

Pour toute question : omraniwiem62@gmail.com
