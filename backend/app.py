from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta
import traceback

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'votre-cle-secrete-super-secure'

# Configuration Flask-Mail (remplace par ton email et mot de passe Gmail App)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'omraniwiem62@gmail.com'      # <-- Mets ton email ici !
app.config['MAIL_PASSWORD'] = 'iibm mwcg wysk kqmm'        # <-- Mets ton mot de passe d'application Gmail ici !
mail = Mail(app)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/medical_reminder")
try:
    client = MongoClient(mongo_uri)
    db = client["medical_reminder"]
    # Test de connexion
    client.admin.command('ping')
    print("✅ Connexion MongoDB réussie")
except Exception as e:
    print(f"❌ Erreur connexion MongoDB: {e}")
    print("💡 Vous pouvez continuer sans MongoDB - les données seront temporaires")
    db = None

def send_reminder(med):
    if 'email' in med and med['email']:
        msg = Message(
            subject="Rappel prise de médicament",
            sender=app.config['MAIL_USERNAME'],
            recipients=[med['email']],
            body=f"N'oubliez pas de prendre {med['nom']} ({med['dose']}) à {med['heure']} !"
        )
        try:
            mail.send(msg)
            print(f"Email envoyé à {med['email']} pour {med['nom']} à {med['heure']}")
        except Exception as e:
            print(f"Erreur envoi email: {e}")

def check_reminders():
    now = datetime.now().strftime("%H:%M")
    meds = list(db.medicaments.find({"heure": now}))
    for med in meds:
        send_reminder(med)

# Lancer le scheduler pour vérifier chaque minute
scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, 'interval', minutes=1)
scheduler.start()

# Routes d'authentification
@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Données JSON requises"}), 400
            
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({"error": "Tous les champs sont requis"}), 400
        
        # Si pas de MongoDB, retourner un succès factice
        if db is None:
            return jsonify({"message": "Utilisateur créé avec succès (mode test)"}), 201
        
        # Vérifier si l'utilisateur existe déjà
        if db.users.find_one({"email": email}):
            return jsonify({"error": "Cet email est déjà utilisé"}), 400
        
        # Hasher le mot de passe
        hashed_password = generate_password_hash(password)
        
        # Créer l'utilisateur
        user = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "created_at": datetime.utcnow()
        }
        
        db.users.insert_one(user)
        
        return jsonify({"message": "Utilisateur créé avec succès"}), 201
        
    except Exception as e:
        print(f"Erreur register: {e}")
        return jsonify({"error": f"Erreur serveur: {str(e)}"}), 500

@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Données JSON requises"}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email et mot de passe requis"}), 400
        
        # Si pas de MongoDB, utiliser un utilisateur par défaut pour les tests
        if db is None:
            if email == "test@test.com" and password == "test123":
                token = jwt.encode({
                    'user_id': 'test_user',
                    'email': email,
                    'exp': datetime.utcnow() + timedelta(days=1)
                }, app.config['SECRET_KEY'], algorithm='HS256')
                
                return jsonify({
                    "message": "Connexion réussie (mode test)",
                    "token": token,
                    "user": {
                        "email": email,
                        "name": "Utilisateur Test"
                    }
                }), 200
            else:
                return jsonify({"error": "Email ou mot de passe incorrect"}), 401
        
        # Trouver l'utilisateur
        user = db.users.find_one({"email": email})
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"error": "Email ou mot de passe incorrect"}), 401
        
        # Créer le token JWT
        try:
            token = jwt.encode({
                'user_id': str(user['_id']),
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(days=1)
            }, app.config['SECRET_KEY'], algorithm='HS256')
        except Exception as jwt_error:
            print(f"Erreur JWT: {jwt_error}")
            return jsonify({"error": "Erreur lors de la création du token"}), 500
        
        return jsonify({
            "message": "Connexion réussie",
            "token": token,
            "user": {
                "email": user['email'],
                "name": user['name']
            }
        }), 200
        
    except Exception as e:
        print(f"Erreur login: {e}")
        return jsonify({"error": f"Erreur serveur: {str(e)}"}), 500

@app.route("/auth/verify", methods=["GET"])
def verify_token():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token manquant"}), 401
        
        # Enlever 'Bearer ' du token
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Décoder le token
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        return jsonify({"message": "Token valide", "user_id": data['user_id']}), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expiré"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token invalide"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/test-email", methods=["POST"])
def test_email():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email requis"}), 400
        
        msg = Message(
            subject="Test d'envoi d'email",
            sender=app.config['MAIL_USERNAME'],
            recipients=[email],
            body="Ceci est un email de test de votre application de rappel de médicaments !"
        )
        
        mail.send(msg)
        
        return jsonify({"message": "Email de test envoyé avec succès !"}), 200
        
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'envoi: {str(e)}"}), 500

@app.route("/medicaments", methods=["GET", "POST"])
def medicaments_route():
    if request.method == "GET":
        meds = list(db.medicaments.find({}, {"_id": 0}))
        return jsonify(meds)
    else:  # POST
        try:
            data = request.get_json(force=True)
            for champ in ["nom", "dose", "heure", "frequence", "email"]:
                if champ not in data:
                    raise ValueError(f"Le champ '{champ}' est requis.")
            db.medicaments.insert_one(data)
            return jsonify({"message": "Médicament ajouté", "data": data}), 201
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)