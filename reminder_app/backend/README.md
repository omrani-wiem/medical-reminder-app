# 🏥 Medical Reminder Backend

Backend Flask pour l'application Medical Reminder avec MongoDB et envoi d'emails.

## 🔧 Installation

### 1. Créer un environnement virtuel (recommandé)
```bash
python -m venv venv
```

### 2. Activer l'environnement virtuel
**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

##  Configuration des variables d'environnement

### 1. Créer le fichier `.env`
Copiez le fichier d'exemple :
```bash
copy env.example .env
```

### 2. Remplir les variables dans `.env`

#### **MongoDB**
```env
MONGO_URI=mongodb://localhost:27017/medical_reminder
MONGO_DB_NAME=medical_reminder
```

#### **Gmail SMTP (pour les emails)**
 **Important** : Pour Gmail, vous devez créer un **"Mot de passe d'application"**

**Étapes :**
1. Allez sur votre compte Google : https://myaccount.google.com/
2. Sécurité → Validation en deux étapes (activez-la si ce n'est pas fait)
3. Sécurité → Mots de passe des applications
4. Créez un nouveau mot de passe pour "Medical Reminder App"
5. Copiez le mot de passe généré (format : `xxxx xxxx xxxx xxxx`)

```env
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_DEFAULT_SENDER_EMAIL=votre.email@gmail.com
```

#### **Frontend URL (CORS)**
```env
FRONTEND_URL=http://localhost:3000
```

### 3. Exemple de `.env` complet
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
MAIL_USERNAME=rochdifridhi39@gmail.com
MAIL_PASSWORD=avks xlsw scod szth
MAIL_DEFAULT_SENDER_NAME=Medical Reminder App
MAIL_DEFAULT_SENDER_EMAIL=rochdifridhi39@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Tokens
TOKEN_EXPIRATION_HOURS=24
RESET_CODE_EXPIRATION_MINUTES=15
```

##  Démarrer le serveur

```bash
python app.py
```

Le serveur démarre sur : **http://localhost:5000**

##  API Endpoints

### Authentication
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `POST /auth/forgot-password` - Demander un code de réinitialisation
- `POST /auth/reset-password` - Réinitialiser le mot de passe
- `POST /auth/change-password` - Changer le mot de passe

### Medications
- `GET /medicaments?email=...` - Récupérer les médicaments
- `POST /medicaments` - Ajouter un médicament

### Settings
- `GET /settings?email=...` - Récupérer les paramètres
- `PUT /settings` - Mettre à jour les paramètres

##  Sécurité

### Fichiers sensibles
-  `.env` - **JAMAIS commit sur GitHub**
-  `env.example` - Template sans données sensibles (safe pour GitHub)

### .gitignore
Le fichier `.gitignore` est configuré pour ignorer :
- `.env` et toutes variations
- `__pycache__/` et fichiers Python compilés
- `venv/` environnement virtuel
- Logs et fichiers de backup

##  Base de données

### MongoDB Collections

#### `users`
```json
{
  "_id": ObjectId,
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "password": "hashed_string",
  "faculte": "string",
  "niveau": "string",
  "created_at": "ISO_date",
  "reset_code": "string (temporaire)",
  "reset_code_expires": "ISO_date (temporaire)"
}
```

#### `medicaments`
```json
{
  "_id": ObjectId,
  "email": "string",
  "nom": "string",
  "dosage": "string",
  "forme": "string",
  "couleur": "string",
  "frequence": "string",
  "duree": "number",
  "stock_actuel": "number",
  "stock_minimum": "number",
  "medecin": "string",
  "instructions": "string",
  "dateDebut": "ISO_date",
  "dateFin": "ISO_date",
  "heures_prise": ["string"]
}
```

##  Configuration Email

### Test de l'envoi d'email
Pour tester si l'email fonctionne :
1. Utilisez "Mot de passe oublié" dans l'app
2. Vérifiez votre boîte de réception (et spam)

### Problèmes courants
- **535-5.7.8 Username and Password not accepted** → Mauvais mot de passe d'application
-  **Connection refused** → Vérifiez MAIL_SERVER et MAIL_PORT
-  **Must issue a STARTTLS command** → Vérifiez MAIL_USE_TLS=True

##  Développement

### Structure du projet
```
backend/
├── app.py              # Application Flask principale
├── requirements.txt    # Dépendances Python
├── .env               # Variables d'environnement (local, non commité)
├── env.example        # Template de configuration
├── .gitignore         # Fichiers à ignorer par Git
└── README.md          # Ce fichier
```

##  Notes

- Le serveur utilise Flask en mode développement
- Les mots de passe sont hashés avec SHA-256
- Les codes de réinitialisation expirent après 15 minutes
- CORS configuré pour accepter le frontend sur localhost:3000
