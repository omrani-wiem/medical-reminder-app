# 💊 Medical Reminder App

Une application complète de rappel de médicaments avec authentification sécurisée et architecture DevOps.

## 🚀 Fonctionnalités

- ✅ Ajout de médicaments avec horaires
- 📧 Notifications par email automatiques
- 🕐 Vérification toutes les minutes
- 🧪 Test de configuration email
- 📱 Interface utilisateur moderne et responsive

## 📋 Prérequis

- Python 3.8+
- Node.js 14+
- MongoDB (local ou distant)
- Compte Gmail avec mot de passe d'application

## 🔧 Configuration

### 1. Configuration Gmail

1. Aller dans votre compte Google
2. Activer l'authentification à 2 facteurs
3. Générer un mot de passe d'application pour "Mail"
4. Remplacer dans `backend/app.py`:
   ```python
   app.config['MAIL_USERNAME'] = 'votre-email@gmail.com'
   app.config['MAIL_PASSWORD'] = 'votre-mot-de-passe-app'
   ```

### 2. Installation automatique

```powershell
# Exécuter le script d'installation
.\setup_and_test.ps1
```

### 3. Installation manuelle

#### Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

## 🖥️ Utilisation

1. Ouvrir http://localhost:3000
2. Remplir le formulaire:
   - **Nom**: Nom du médicament
   - **Dose**: Quantité (ex: "1 comprimé", "5ml")
   - **Heure**: Heure de prise (format 24h)
   - **Fréquence**: Description (ex: "1 fois/jour")
   - **Email**: Votre adresse email
3. Cliquer "Test Email" pour vérifier la configuration
4. Ajouter le médicament
5. L'application enverra automatiquement un email à l'heure programmée

## 🔍 Dépannage

### Problème d'email
- Vérifier le mot de passe d'application Gmail
- Utiliser le bouton "Test Email"
- Vérifier les logs du serveur

### Problème de connexion
- Vérifier que MongoDB est démarré
- Vérifier les URLs dans le frontend (http://127.0.0.1:5000)

### Erreurs communes
- "Erreur 535": Mot de passe Gmail incorrect
- "CORS error": Backend non démarré
- "Connection refused": Mauvaise URL ou port

## 📁 Structure du projet

```
medical_reminder_app/
├── backend/
│   ├── app.py              # Serveur Flask
│   ├── requirements.txt    # Dépendances Python
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.js         # Interface React
│   ├── package.json       # Dépendances Node.js
│   └── Dockerfile
├── docker-compose.yml     # Configuration Docker
└── setup_and_test.ps1    # Script d'installation
```

## 🐳 Docker (optionnel)

```bash
# Lancer avec Docker Compose
docker-compose up --build
```

## 📝 API Endpoints

- `GET /medicaments` - Liste des médicaments
- `POST /medicaments` - Ajouter un médicament
- `POST /test-email` - Tester l'envoi d'email

## ⚡ Caractéristiques techniques

- **Backend**: Flask + MongoDB + APScheduler + Flask-Mail
- **Frontend**: React avec hooks
- **Notifications**: Email automatique via Gmail SMTP
- **Planification**: Vérification toutes les minutes
- **Sécurité**: Validation côté client et serveur

## 🆘 Support

En cas de problème:
1. Vérifier les logs du serveur
2. Tester la configuration email
3. Vérifier que tous les services sont démarrés
4. Consulter la section dépannage ci-dessus

---

**Développé avec ❤️ pour vous aider à ne jamais oublier vos médicaments !**