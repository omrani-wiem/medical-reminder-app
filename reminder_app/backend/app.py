from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
import os
from datetime import datetime, timedelta
import hashlib
import secrets
from dotenv import load_dotenv
from bson import ObjectId

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

# config Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'omraniwiem62@gmail.com'
app.config['MAIL_PASSWORD'] = 'odig ebpj fmeh qzlu'
app.config['MAIL_DEFAULT_SENDER'] = (
    'Medical Reminder App',
    'omraniwiem62@gmail.com'
)
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False
mail = Mail(app)

# config MongoDB
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/medical_reminder')
db_name = os.getenv('MONGO_DB_NAME', 'medical_reminder')
client = MongoClient(mongo_uri)
db = client[db_name]


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def generate_token():
    return secrets.token_hex(32)


def generer_prises(medicament, med_id):
    """Génère toutes les prises futures pour un médicament."""
    prises = []

    date_debut_str = medicament.get("dateDebut", "")
    date_fin_str = medicament.get("dateFin", "")

    # FIX: était "date_debut_str" mal utilisé, variable renommée correctement
    try:
        date_debut = datetime.strptime(date_debut_str, "%Y-%m-%d") if date_debut_str else datetime.now()
    except ValueError:
        date_debut = datetime.now()

    try:
        date_fin = datetime.strptime(date_fin_str, "%Y-%m-%d") if date_fin_str else datetime.now() + timedelta(days=30)
    except ValueError:
        date_fin = datetime.now() + timedelta(days=30)

    heures = medicament.get("heures_prise") or [medicament.get("heure", "08:00")]

    current = date_debut
    while current <= date_fin:
        date_str = current.strftime("%Y-%m-%d")
        for heure in heures:
            prises.append({
                "email":         medicament["email"],
                "userId":        medicament.get("userId", ""),
                "medicamentId":  str(med_id),
                "medicamentNom": medicament["nom"],
                "dosage":        medicament.get("dose", ""),
                "forme":         medicament.get("forme", ""),
                "medecin":       medicament.get("medecin", ""),
                "heurePrevu":    heure,
                "datePrevu":     date_str,
                "heurePrise":    None,
                "datePrise":     None,
                "statut":        "en_attente",
                "retardMinutes": None,
                "created_at":    datetime.now().isoformat()
            })
        current += timedelta(days=1)

    if prises:
        db.prises.insert_many(prises)
        print(f" {len(prises)} prises générées pour {medicament['nom']}")


@app.route("/auth/register", methods=["POST"])
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
            "message": "compte créé avec succès",
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
        return jsonify({"error": str(e)}), 400


@app.route("/medicaments/<med_id>", methods=["PUT", "DELETE"])
def medicament_detail(med_id):

    if request.method == "PUT":
        try:
            data = request.get_json(force=True)
            allowed_fields = [
                "nom", "dose", "forme", "couleur", "frequence",
                "heure", "duree", "stock", "stockMin", "medecin",
                "dateDebut", "dateFin", "instructions"
            ]
            update_data = {k: data[k] for k in allowed_fields if k in data}

            result = db.medicaments.update_one(
                {"_id": ObjectId(med_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                return jsonify({"error": "Médicament non trouvé."}), 404

            return jsonify({"message": "Médicament mis à jour avec succès."}), 200
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400

    elif request.method == "DELETE":
        try:
            result = db.medicaments.delete_one({"_id": ObjectId(med_id)})
            if result.deleted_count == 0:
                return jsonify({"error": "Médicament non trouvé."}), 404

            db.prises.delete_many({"medicamentId": med_id})

            return jsonify({"message": "Médicament supprimé avec succès."}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400


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
            return jsonify({"erreur": "si cet email existe un code de réinitialisation a été envoyé"}), 200

        reset_code = str(secrets.randbelow(900000) + 100000)

        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "reset_code": reset_code,
                "reset_code_expires": datetime.now().timestamp() + 1800
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
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 Réinitialisation</h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Medical Reminder App</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;">
                                                Bonjour <strong>{user['prenom']}</strong>,
                                            </p>
                                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.6;">
                                                Vous avez demandé la réinitialisation de votre mot de passe.
                                            </p>
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
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
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

        print("=" * 70)
        print(f" CODE DE RÉINITIALISATION GÉNÉRÉ")
        print(f" Email: {data['email']}")
        print(f" Code: {reset_code}")
        print(f" Expire dans: 30 minutes")
        print("=" * 70)

        try:
            mail.send(msg)
            print(f" Email envoyé avec succès à {data['email']}")
        except Exception as e:
            print(f"  Erreur envoi email (mais code sauvegardé): {e}")
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

        user = db.users.find_one({"email": data["email"]})

        if not user:
            return jsonify({"error": "Utilisateur non trouvé"}), 404

        if "reset_code" not in user or user["reset_code"] != data["code"]:
            return jsonify({"error": "Code de réinitialisation invalide"}), 400

        if "reset_code_expires" not in user or datetime.now().timestamp() > user["reset_code_expires"]:
            return jsonify({"error": "Code de réinitialisation expiré"}), 400

        db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password": hash_password(data["new_password"]),
                    "password_changed_at": datetime.now().isoformat()
                },
                "$unset": {
                    "reset_code": "",
                    "reset_code_expires": ""
                }
            }
        )

        msg = Message(
            subject="Mot de passe modifié avec succès",
            recipients=[data["email"]],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #27ae60; text-align: center;">✅ Mot de passe modifié</h2>
                        <p>Bonjour {user['prenom']},</p>
                        <p>Votre mot de passe a été modifié avec succès.</p>
                        <p style="font-size: 14px; color: #777;">Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f" Email de confirmation envoyé à {data['email']}")
        except Exception as e:
            print(f" Erreur envoi email de confirmation: {e}")

        return jsonify({"message": "Mot de passe réinitialisé avec succès"}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


# FIX: guillemet mal placé corrigé ("POST]") → "POST")
@app.route("/auth/change-password", methods=["POST"])
def change_password():
    try:
        data = request.get_json(force=True)
        required = ["email", "current_password", "new_password"]
        for field in required:
            if field not in data or not data[field]:
                return jsonify({"error": f"Le champ '{field}' est requis"}), 400

        # FIX: indentation corrigée (était dans la boucle for)
        user = db.users.find_one({"email": data["email"]})

        if not user:
            return jsonify({"error": "utilisateur non trouvé"}), 404

        if user["password"] != hash_password(data["current_password"]):
            return jsonify({"error": "Mot de passe actuel incorrect"}), 401

        if data["current_password"] == data["new_password"]:
            return jsonify({"error": "Le nouveau mot de passe doit être différent de l'ancien"}), 400

        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "password": hash_password(data["new_password"]),
                "password_changed_at": datetime.now().isoformat()
            }}
        )

        msg = Message(
            subject="🔐 Votre mot de passe a été modifié",
            recipients=[data["email"]],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #3498db; text-align: center;">🔐 Mot de passe modifié</h2>
                        <p>Bonjour {user['prenom']},</p>
                        <p>Votre mot de passe a été modifié le {datetime.now().strftime('%d/%m/%Y à %H:%M')}.</p>
                        <p style="color: #e74c3c;">⚠️ Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f" Email de changement de mot de passe envoyé à {data['email']}")
        except Exception as e:
            print(f" Erreur envoi email: {e}")

        return jsonify({"message": "Mot de passe modifié avec succès"}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


def send_reminder(med):
    if 'email' in med and med['email']:
        user = db.users.find_one({"email": med['email']})
        prenom = user['prenom'] if user else "utilisateur"

        # FIX: parenthèse fermante était au mauvais endroit
        msg = Message(
            subject=f" Rappel : {med['nom']} à {med.get('heure', 'prendre maintenant')}",
            recipients=[med['email']],
            html=f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h2 style="color: #3498db; text-align: center;">💊 Rappel de Médicament</h2>
                        <p>Bonjour {prenom},</p>
                        <div style="background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-size: 14px;">Il est temps de prendre :</p>
                            <h1 style="margin: 10px 0; font-size: 28px;">{med['nom']}</h1>
                            <p style="margin: 0; font-size: 18px;">Dosage : {med.get('dose', 'Non spécifié')}</p>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">⏰ {med.get('heure', datetime.now().strftime('%H:%M'))}</p>
                        </div>
                        <p style="font-size: 14px; color: #777;">📋 Instructions : {med.get('instructions', 'Prenez selon les indications de votre médecin')}</p>
                        <p style="font-size: 14px; color: #777;">💊 Forme : {med.get('forme', 'Comprimé')}</p>
                        <p style="font-size: 14px; color: #27ae60;">✅ N'oubliez pas de marquer votre prise dans l'application !</p>
                    </div>
                </body>
            </html>
            """
        )
        try:
            mail.send(msg)
            print(f" Email de rappel envoyé à {med['email']} pour {med['nom']}")
        except Exception as e:
            print(f" Erreur envoi email: {e}")


def check_reminders():
    now = datetime.now().strftime("%H:%M")
    print(f" Vérification des rappels à {now}...")

    meds_single = list(db.medicaments.find({"heure": now}))
    meds_multiple = list(db.medicaments.find({"heures_prise": now}))

    all_meds = meds_single + meds_multiple

    if all_meds:
        print(f" {len(all_meds)} rappel(s) à envoyer")
        for med in all_meds:
            send_reminder(med)
    else:
        print(f"✓ Aucun rappel à envoyer")


# lance scheduler pour vérifier chaque minute
scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, 'interval', minutes=1)
scheduler.start()


@app.route("/medicaments", methods=["GET", "POST"])
def medicaments_route():
    if request.method == "GET":
        user_email = request.args.get('email')

        if user_email:
            meds = list(db.medicaments.find({"email": user_email}))
        else:
            meds = list(db.medicaments.find({}))

        for m in meds:
            m["_id"] = str(m["_id"])

        return jsonify(meds)
    else:  # POST
        try:
            data = request.get_json(force=True)
            required_fields = ["nom", "dose", "frequence", "email"]
            for champ in required_fields:
                if champ not in data:
                    raise ValueError(f"Le champ '{champ}' est requis.")

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

            generer_prises(medicament, result.inserted_id)
            medicament["_id"] = str(result.inserted_id)
            return jsonify({"message": "Médicament ajouté", "data": medicament}), 201
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400


@app.route("/prises", methods=["GET"])
def get_prises():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "Email requis"}), 400

        prises = list(db.prises.find({"email": email}))

        for p in prises:
            p["_id"] = str(p["_id"])

        return jsonify(prises), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/prises/<prise_id>", methods=["PATCH"])
def marquer_prise(prise_id):
    try:
        data = request.get_json(force=True)

        heure_prise = data.get("heurePrise") or datetime.now().strftime("%H:%M")
        heure_prevu = data.get("heurePrevu", "")

        retard = None
        if heure_prevu:
            try:
                h_prev = datetime.strptime(heure_prevu, "%H:%M")
                h_pris = datetime.strptime(heure_prise, "%H:%M")
                retard = int((h_pris - h_prev).total_seconds() / 60)
            except ValueError:
                pass

        result = db.prises.update_one(
            {"_id": ObjectId(prise_id)},
            {"$set": {
                "statut":        "pris",
                "heurePrise":    heure_prise,
                "datePrise":     datetime.now().isoformat(),
                "retardMinutes": retard
            }}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Prise non trouvée"}), 404

        return jsonify({"message": "Prise marquée comme prise"}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


@app.route("/rappels", methods=["GET", "POST"])
def rappels_route():

    if request.method == "GET":
        try:
            email = request.args.get("email")
            if not email:
                return jsonify({"error": "Email requis"}), 400

            rappels = list(db.rappels.find({"email": email}))
            for r in rappels:
                r["_id"] = str(r["_id"])

            return jsonify(rappels), 200

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 500

    elif request.method == "POST":
        try:
            data = request.get_json(force=True)

            required = ["email", "medicament", "heures", "jours"]
            for field in required:
                if field not in data:
                    return jsonify({"error": f"Champ '{field}' requis"}), 400

            rappel = {
                "email":      data["email"],
                "userId":     data.get("userId", ""),
                "medicament": data["medicament"],
                "heures":     data["heures"],
                "jours":      data["jours"],
                "actif":      data.get("actif", True),
                "son":        data.get("son", True),
                "vibration":  data.get("vibration", True),
                "created_at": datetime.now().isoformat()
            }

            result = db.rappels.insert_one(rappel)
            rappel["_id"] = str(result.inserted_id)

            return jsonify(rappel), 201

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400


@app.route("/rappels/<rappel_id>", methods=["PUT", "DELETE"])
def rappel_detail(rappel_id):

    if request.method == "PUT":
        try:
            data = request.get_json(force=True)
            allowed = ["medicament", "heures", "jours", "actif", "son", "vibration"]
            update_data = {k: data[k] for k in allowed if k in data}

            result = db.rappels.update_one(
                {"_id": ObjectId(rappel_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                return jsonify({"error": "Rappel non trouvé"}), 404

            return jsonify({"message": "Rappel modifié avec succès"}), 200

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400

    elif request.method == "DELETE":
        try:
            result = db.rappels.delete_one({"_id": ObjectId(rappel_id)})

            if result.deleted_count == 0:
                return jsonify({"error": "Rappel non trouvé"}), 404

            return jsonify({"message": "Rappel supprimé avec succès"}), 200

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 400


@app.route("/statistiques", methods=["GET"])
def get_statistiques():
    try:
        email   = request.args.get("email")
        periode = request.args.get("periode", "30j")

        if not email:
            return jsonify({"error": "Email requis"}), 400

        jours_map  = {"7j": 7, "30j": 30, "90j": 90, "1an": 365}
        jours      = jours_map.get(periode, 30)
        date_limit = (datetime.now() - timedelta(days=jours)).strftime("%Y-%m-%d")

        prises      = list(db.prises.find({"email": email, "datePrevu": {"$gte": date_limit}}))
        medicaments = list(db.medicaments.find({"email": email}))

        total    = len(prises)
        reussies = len([p for p in prises if p["statut"] == "pris"])
        manquees = len([p for p in prises if p["statut"] == "manque"])
        retard   = len([p for p in prises if p["statut"] == "pris"
                        and (p.get("retardMinutes") or 0) > 10])
        adherence_globale = round(reussies / total * 100) if total > 0 else 0

        aujourd_hui  = datetime.now()
        jour_semaine = aujourd_hui.weekday()
        jours_labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

        donnees_adherence = []
        for i, label in enumerate(jours_labels):
            date_jour = aujourd_hui - timedelta(days=jour_semaine) + timedelta(days=i)
            date_str  = date_jour.strftime("%Y-%m-%d")

            prises_jour = [p for p in prises if p["datePrevu"] == date_str]
            total_j     = len(prises_jour)
            pris_j      = len([p for p in prises_jour if p["statut"] == "pris"])

            donnees_adherence.append({
                "jour":      label,
                "adherence": round(pris_j / total_j * 100) if total_j > 0 else 0,
                "prises":    pris_j,
                "manques":   total_j - pris_j,
                "total":     total_j
            })

        donnees_temporelles = []
        for i in range(9, -1, -1):
            date_mois  = (datetime.now().replace(day=1) - timedelta(days=i * 30))
            mois_debut = date_mois.strftime("%Y-%m-01")
            dernier_j  = (date_mois.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
            mois_fin   = dernier_j.strftime("%Y-%m-%d")
            mois_label = date_mois.strftime("%b")

            prises_mois = [p for p in prises if mois_debut <= p["datePrevu"] <= mois_fin]
            total_m     = len(prises_mois)
            pris_m      = len([p for p in prises_mois if p["statut"] == "pris"])

            donnees_temporelles.append({
                "mois":      mois_label,
                "adherence": round(pris_m / total_m * 100) if total_m > 0 else 0,
                "prises":    pris_m,
                "manques":   total_m - pris_m,
                "total":     total_m
            })

        pris_a_lheure = reussies - retard
        donnees_repartition = [
            {"name": "Prises à l'heure", "value": pris_a_lheure, "color": "#27ae60"},
            {"name": "Prises manquées",  "value": manquees,       "color": "#e74c3c"},
            {"name": "Prises en retard", "value": retard,         "color": "#f39c12"}
        ]

        donnees_medicaments = []
        for med in medicaments:
            med_id     = str(med["_id"])
            prises_med = [p for p in prises if p.get("medicamentId") == med_id]
            total_med  = len(prises_med)
            pris_med   = len([p for p in prises_med if p["statut"] == "pris"])

            donnees_medicaments.append({
                "medicament": med["nom"],
                "prises":     pris_med,
                "manques":    total_med - pris_med,
                "adherence":  round(pris_med / total_med * 100) if total_med > 0 else 0
            })

        heures_cles    = ["06", "08", "12", "14", "18", "20", "22"]
        donnees_heures = []
        for h in heures_cles:
            count = len([
                p for p in prises
                if (p.get("heurePrise") or p.get("heurePrevu", "")).startswith(h)
            ])
            donnees_heures.append({"heure": f"{h}h", "prises": count})

        meilleur_jour = max(donnees_adherence, key=lambda x: x["adherence"])["jour"] \
                        if donnees_adherence else "N/A"
        pire_jour     = min(donnees_adherence, key=lambda x: x["adherence"])["jour"] \
                        if donnees_adherence else "N/A"

        return jsonify({
            "adherenceGlobale":   adherence_globale,
            "prisesReussies":     reussies,
            "prisesManquees":     manquees,
            "prisesRetard":       retard,
            "total":              total,
            "meilleurJour":       meilleur_jour,
            "pireJour":           pire_jour,
            "heureOptimale":      "08h00",
            "donneesAdherence":   donnees_adherence,
            "donneesTemporelles": donnees_temporelles,
            "donneesRepartition": donnees_repartition,
            "donneesMedicaments": donnees_medicaments,
            "donneesHeures":      donnees_heures
        }), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/settings", methods=["GET"])
def get_settings():
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"message": "Email requis"}), 400

        user = db["users"].find_one({"email": email})
        if not user:
            return jsonify({"message": "Utilisateur non trouvé"}), 404

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


@app.route("/settings", methods=["PUT"])
def update_settings():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"message": "Email requis"}), 400

        allowed_fields = [
            "nom", "prenom", "telephone", "dateNaissance", "adresse",
            "theme", "langue", "timezone",
            "notifPush", "notifEmail", "notifSMS", "rappelAvance",
            "allergies", "maladiesChroniques", "medecinTraitant", "pharmacie"
        ]

        update_data = {}
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]

        if not update_data:
            return jsonify({"message": "Aucune donnée à mettre à jour"}), 400

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
    print("\n" + "=" * 70)
    print(" Démarrage du serveur Medical Reminder")
    print("=" * 70)
    app.run(host="0.0.0.0", port=5000, debug=False)