from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # autorise React à accéder à Flask

# Base de données en mémoire (simple pour commencer)
medicaments = []

@app.route("/medicaments", methods=["GET"])
def get_medicaments():
    return jsonify(medicaments)

@app.route("/medicaments", methods=["POST"])
def add_medicament():
    data = request.json
    medicaments.append(data)
    return jsonify({"message": "Médicament ajouté", "data": data}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
