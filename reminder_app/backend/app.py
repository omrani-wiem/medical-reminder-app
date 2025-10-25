from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
import os
from datetime import datetime
import hashlib
import secrets
from dotenv import load_dotenv

# on charge les variables d'environnement
load_dotenv()

app = Flask(__name__)

frontend_urls = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:5173',
    os.getenv('FRONTEND_URL', 'http://localhost:3000')
]
CORS(app, resources={
     r"/*": {
        "origins": frontend_urls,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
#config Flask-Mail
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.example.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = (
    os.getenv('MAIL_DEFAULT_SENDER_NAME', 'Medical Reminder App'),
    os.getenv('MAIL_DEFAULT_SENDER_EMAIL')
)
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False
mail = Mail(app)

#config MongoDB
mongo_uri =os.getenv('MONGO_URI', 'mongodb://localhost:27017/medical_reminder')
db_name = os.getenv('MONGO_DB_NAME', 'medical_reminder')
client = MongoClient(mongo_uri)
db = client[db_name]

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()# Hashage du mot de passe avec SHA-256

def generate_token():
    return secrets.token_hex(32)
@app.route("/auth/register" , methods=["POST"])
def register():
    try:
        data = request.get_json(force=True)
        required_fields = ["nom", "prenom", "email", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"le champ '{field}' est requis"}), 400
            
        existing_user = db.users.find_one({"email": data["email"]})
        if existing_user:
            return jsonify({"error": "Un utilisateur avec cet email existe déjà."}), 400
        
        #on va creer le nouvel uilisateur
        new_user = {
            "nom": data["nom"],
            "prenom": data["prenom"],
            "email": data["email"],
            "password": hash_password(data["password"]),
            "faculte": data.get("faculte", ""),
            "niveau": data.get("niveau", ""),
            "created_at": datetime.now().isoformat()
        }

        result = db.users.insert_one(new_user)

        return jsonify({
            "message": "compte créé avec succés",
            "user": {
                "id": str(result.inserted_id),
                "nom": new_user["nom"],
                "prenom": new_user["prenom"],
                "email": new_user["email"],
            }
        }), 201
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400#400 Bad Request pour les erreurs client

@app.route("/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email et mot de passe sont requis."}), 400
        
        user = db.users.find_one({"email": data["email"]})
        if not user:
            return jsonify({"error": "Utilisateur non trouvé."}), 401
        
        if user["password"] != hash_password(data["password"]):
            return jsonify({"error": "Mot de passe incorrect."}), 401
        
        token = generate_token()

        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"token": token, "last_login": datetime.now().isoformat()}}
        )

        return jsonify({
            "message": "Connexion réussie.",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "nom": user["nom"],
                "prenom": user["prenom"],
                "email": user["email"],
                "faculte": user.get("faculte", ""),
                "niveau": user.get("niveau", "")
            }
        }), 200
       
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400
    
@app.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json(force=True)

        if not data.get("email"):
            return jsonify({"erreur": "Email requis"}), 400
        
        user = db.users.find_one({"email": data["email"]})

        if not user:
            return jsonify({"erreur": "si cet email existe un code de reintialisation a ete envoyé"}), 200
        
        reset_code = str(secrets.randbelow(900000) + 100000)
        
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "reset_code":reset_code,
                "reset_code_expires": datetime.now().timestamp() + 1800 #code valable 30 minutes
            }}
        )

        msg = Message(
            subject="code de reinitialisation - Medical Reminder",
            recipients=[data["email"]],
            html=f"""
             <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 Réinitialisation</h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Medical Reminder App</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;">
                                                Bonjour <strong>{user['prenom']}</strong>,
                                            </p>
                                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.6;">
                                                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Medical Reminder.
                                            </p>
                                            
                                            <!-- Code Box -->
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; text-align: center;">
                                                        <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: 500; opacity: 0.9;">
                                                            VOTRE CODE DE RÉINITIALISATION
                                                        </p>
                                                        <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                                            {reset_code}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <div style="margin: 30px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                                <p style="margin: 0; font-size: 14px; color: #856404;">
                                                    ⚠️ <strong>Important :</strong> Ce code expire dans 30 minutes.
                                                </p>
                                            </div>
                                            
                                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; line-height: 1.6;">
                                                Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
                                            </p>
                                            <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                                                Votre mot de passe actuel restera inchangé.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                                                Medical Reminder App - Gestion de vos médicaments
                                            </p>
                                            <p style="margin: 0; font-size: 12px; color: #999;">
                                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
            """
        )

        print("=" *70)
        print(f"🔐 CODE DE RÉINITIALISATION GÉNÉRÉ")
        print(f"📧 Email: {data['email']}")
        print(f"🔢 Code: {reset_code}")
        print(f"⏰ Expire dans: 30 minutes")
        print("=" * 70)
        
        try:
            mail.send(msg)
            print(f"✅ Email envoyé avec succès à {data['email']}")
        except Exception as e:
            print(f"⚠️  Erreur envoi email (mais code sauvegardé): {e}")
            import traceback
            print(traceback.format_exc())

            return jsonify({"message": "Si cet email existe, un code de réinitialisation a été envoyé"}), 200
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400

@app.route("/auth/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json(force=True)
        
        required = ["email", "code", "new_password"]
        for field in required:
            if field not in data or not data[field]:
                return jsonify({"error": f"Le champ '{field}' est requis"}), 400
        
        # Vérifier l'utilisateur
        user = db.users.find_one({"email": data["email"]})
        
        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404
        
        # Vérifier le code et son expiration
        if "reset_code" not in user or user["reset_code"] != data["code"]:
            return jsonify({"error": "Code de réinitialisation invalide"}), 400
        
        if "reset_code_expires" not in user or datetime.now().timestamp() > user["reset_code_expires"]:
            return jsonify({"error": "Code de réinitialisation expiré"}), 400
        
        # Mettre à jour le mot de passe
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "password": hash_password(data["new_password"]),
                "password_changed_at": datetime.now().isoformat()
            },
            "$unset": {
                "reset_code": "",
                "reset_code_expires": ""
            }}
        )
        msg = Message(
            subject="✅ Mot de passe modifié avec succès",
            recipients=[data["email"]],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #27ae60; text-align: center;">✅ Mot de passe modifié</h2>
                        <p style="font-size: 16px; color: #555;">Bonjour {user['prenom']},</p>
                        <p style="font-size: 16px; color: #555;">Votre mot de passe a été modifié avec succès.</p>
                        <p style="font-size: 14px; color: #777;">Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">Wiem Omrani Reminder App</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f"✅ Email de confirmation envoyé à {data['email']}")
        except Exception as e:
            print(f"⚠️ Erreur envoi email de confirmation: {e}")
        
        return jsonify({"message": "Mot de passe réinitialisé avec succès"}), 200
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400

@app.route("/auth/change-password", methods=["POST])"])
def change_password():
    try:
        data = request.get_json(force=True)
        required = ["email", "current_password", "new_password"]
        for field in required:
            if field not in data or not data[field]:
                return jsonify({"error": f"Le champ '{field}' est requis"}), 400
            #verifie l'utilisateur
            user = db.users.find_one({"email": data["email"]})

            if not user:
                return jsonify({"error": "utilisateur non trouvé"}), 404
            
            #verif ancien mot de passe
            if user["password"] != hash_password(data["current_password"]):
                return jsonify({"error": "Mot de passe actuel incorrect"}), 401
        
            if data["current_password"] == data["new_password"]:
                return jsonify({"error": "Le nouveau mot de passe doit être différent de l'ancien"}), 400
            #mise a jour du mot de passe
            db.users.update_one(
                {"_id": user["_id"]},
                 {"$set": {
                     "password": hash_password(data["new_password"]),
                     "password_changed_at": datetime.now().isoformat()
                 }}
            )

            # mail de confirmation
            msg = Message(
            subject="🔐 Votre mot de passe a été modifié",
            recipients=[data["email"]],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #3498db; text-align: center;">🔐 Mot de passe modifié</h2>
                        <p style="font-size: 16px; color: #555;">Bonjour {user['prenom']},</p>
                        <p style="font-size: 16px; color: #555;">Votre mot de passe a été modifié avec succès le {datetime.now().strftime('%d/%m/%Y à %H:%M')}.</p>
                        <p style="font-size: 14px; color: #e74c3c;">⚠️ Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">Wiem Omrani Reminder App</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f"✅ Email de changement de mot de passe envoyé à {data['email']}")
        except Exception as e:
            print(f"⚠️ Erreur envoi email: {e}")
        
        return jsonify({"message": "Mot de passe modifié avec succès"}), 200
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400

def send_reminder(med):
    if 'email' in med and med['email']:
        user = db.users.find_one({"email": med['email']})
        prenom = user['prenom'] if user else "utilisateur"

        msg = Message(
            subject=f"💊 Rappel : {med['nom']} à {med.get('heure', 'prendre maintenant')}",
            recipients=[med['email']],
            html=f"""
        )
        <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #3498db; text-align: center;">💊 Rappel de Médicament</h2>
                        <p style="font-size: 16px; color: #555;">Bonjour {prenom},</p>
                        <div style="background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px;">Il est temps de prendre :</p>
                            <h1 style="margin: 10px 0; font-size: 28px;">{med['nom']}</h1>
                            <p style="margin: 0; font-size: 18px;">Dosage : {med.get('dose', 'Non spécifié')}</p>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">⏰ {med.get('heure', datetime.now().strftime('%H:%M'))}</p>
                        </div>
                        <p style="font-size: 14px; color: #777;">📋 Instructions : {med.get('instructions', 'Prenez selon les indications de votre médecin')}</p>
                        <p style="font-size: 14px; color: #777;">💊 Forme : {med.get('forme', 'Comprimé')}</p>
                        <p style="font-size: 14px; color: #27ae60;">✅ N'oubliez pas de marquer votre prise dans l'application !</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #999; text-align: center;">Wiem Omrani Reminder App - Votre santé nous tient à cœur 💙</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f"✅ Email de rappel envoyé à {med['email']} pour {med['nom']} à {med.get('heure', 'maintenant')}")
        except Exception as e:
            print(f"❌ Erreur envoi email: {e}")


def check_reminders():
    now = datetime.now().strftime("%H:%M")
    print(f"⏰ Vérification des rappels à {now}...")
    
    # Chercher les médicaments avec l'heure actuelle dans le champ 'heure' ou 'heures_prise'
    meds_single = list(db.medicaments.find({"heure": now}))
    meds_multiple = list(db.medicaments.find({"heures_prise": now}))
    
    all_meds = meds_single + meds_multiple
    
    if all_meds:
        print(f"📧 {len(all_meds)} rappel(s) à envoyer")
        for med in all_meds:
            send_reminder(med)
    else:
        print(f"✓ Aucun rappel à envoyer")

# lance sheduler pour verifier chaque minute
scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, 'interval', minutes=1)
scheduler.start()

@app.route("/medicaments", methods=["GET", "POST"])
def medicaments_route():
    if request.method == "GET":
        # Récupérer l'email de l'utilisateur depuis les paramètres de requête
        user_email = request.args.get('email')
        
        if user_email:
            # Filtrer par utilisateur
            meds = list(db.medicaments.find({"email": user_email}, {"_id": 0}))
        else:
            # Récupérer tous les médicaments
            meds = list(db.medicaments.find({}, {"_id": 0}))
        
        return jsonify(meds)
    else:  # POST
        try:
            data = request.get_json(force=True)
         # Champs requis de base
            required_fields = ["nom", "dose", "frequence", "email"]
            for champ in required_fields:
                if champ not in data:
                    raise ValueError(f"Le champ '{champ}' est requis.")
            
            # Ajouter des champs par défaut
            medicament = {
                "nom": data["nom"],
                "dose": data["dose"],
                "forme": data.get("forme", "Comprimé"),
                "couleur": data.get("couleur", ""),
                "frequence": data["frequence"],
                "heure": data.get("heure", "08:00"),
                "duree": data.get("duree", ""),
                "stock": data.get("stock", 0),
                "stockMin": data.get("stockMin", 0),
                "medecin": data.get("medecin", ""),
                "dateDebut": data.get("dateDebut", ""),
                "dateFin": data.get("dateFin", ""),
                "instructions": data.get("instructions", ""),
                "email": data["email"],
                "userId": data.get("userId", ""),
                "created_at": datetime.now().isoformat()
            }
            
            result = db.medicaments.insert_one(medicament)
            # Retirer _id avant de renvoyer la réponse
            medicament.pop('_id', None)
            return jsonify({"message": "Médicament ajouté", "data": medicament}), 201
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400

# Route pour récupérer les paramètres utilisateur
@app.route("/settings", methods=["GET"])
def get_settings():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"message": "Email requis"}), 400
        
        user = db["users"].find_one({"email": email})
        if not user:
            return jsonify({"message": "Utilisateur non trouvé"}), 404
        
        # Retourner les paramètres (sans le mot de passe)
        settings = {
            "nom": user.get("nom", ""),
            "prenom": user.get("prenom", ""),
            "email": user.get("email", ""),
            "telephone": user.get("telephone", ""),
            "dateNaissance": user.get("dateNaissance", ""),
            "adresse": user.get("adresse", ""),
            "theme": user.get("theme", "clair"),
            "langue": user.get("langue", "fr"),
            "timezone": user.get("timezone", "Europe/Paris"),
            "notifPush": user.get("notifPush", True),
            "notifEmail": user.get("notifEmail", True),
            "notifSMS": user.get("notifSMS", False),
            "rappelAvance": user.get("rappelAvance", 15),
            "allergies": user.get("allergies", ""),
            "maladiesChroniques": user.get("maladiesChroniques", ""),
            "medecinTraitant": user.get("medecinTraitant", ""),
            "pharmacie": user.get("pharmacie", "")
        }
        
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({"message": "Erreur serveur", "error": str(e)}), 500

# Route pour sauvegarder les paramètres utilisateur
@app.route("/settings", methods=["PUT"])
def update_settings():
    try:
        data = request.get_json()
        email = data.get("email")
        
        if not email:
            return jsonify({"message": "Email requis"}), 400
        
        # Champs autorisés à être mis à jour
        allowed_fields = [
            "nom", "prenom", "telephone", "dateNaissance", "adresse",
            "theme", "langue", "timezone",
            "notifPush", "notifEmail", "notifSMS", "rappelAvance",
            "allergies", "maladiesChroniques", "medecinTraitant", "pharmacie"
        ]
        
        # Créer l'objet de mise à jour
        update_data = {}
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"message": "Aucune donnée à mettre à jour"}), 400
        
        # Mettre à jour dans la base de données
        result = db["users"].update_one(
            {"email": email},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Utilisateur non trouvé"}), 404
        
        return jsonify({"message": "Paramètres sauvegardés avec succès"}), 200
    except Exception as e:
        return jsonify({"message": "Erreur serveur", "error": str(e)}), 500

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 Démarrage du serveur Medical Reminder - Wiem Omrani")
    print("="*70)
    print("📍 Routes disponibles:")
    print("   POST /auth/register         - Inscription")
    print("   POST /auth/login            - Connexion")
    print("   POST /auth/forgot-password  - Mot de passe oublié (envoi code)")
    print("   POST /auth/reset-password   - Réinitialiser mot de passe (avec code)")
    print("   POST /auth/change-password  - Changer mot de passe (utilisateur connecté)")
    print("   GET  /medicaments           - Liste des médicaments")
    print("   POST /medicaments           - Ajouter un médicament")
    print("   GET  /settings              - Récupérer les paramètres utilisateur")
    print("   PUT  /settings              - Sauvegarder les paramètres utilisateur")
    print("\n📧 Configuration Email:")
    print(f"   Expéditeur: {app.config['MAIL_USERNAME']}")
    print("   Rappels automatiques activés ⏰")
    print("   🌍 Support multilingue: Français, English, العربية")
    print("="*70 + "\n")
    app.run(host="0.0.0.0", port=5000, debug=False)
            

        
        
            

        




