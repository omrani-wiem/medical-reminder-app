from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration Flask-Mail (remplace par ton email et mot de passe Gmail App)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'omraniwiem62@gmail.com'      # <-- Mets ton email ici !
app.config['MAIL_PASSWORD'] = 'iibm mwcg wysk kqmm'        # <-- Mets ton mot de passe d'application Gmail ici !
mail = Mail(app)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/medical_reminder")
client = MongoClient(mongo_uri)
db = client["medical_reminder"]

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
    app.run(host="0.0.0.0", port=5000)