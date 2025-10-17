"""
Script pour afficher le code de réinitialisation d'un utilisateur
Utile si l'email n'arrive pas
"""
from pymongo import MongoClient
from datetime import datetime
import os

# Connexion MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/medical_reminder")
client = MongoClient(mongo_uri)
db = client["medical_reminder"]

def voir_code_reset():
    """Affiche le code de réinitialisation pour un email donné"""
    
    email = input("Entrez l'email de l'utilisateur: ").strip()
    
    if not email:
        print("❌ Email vide!")
        return
    
    # Rechercher l'utilisateur
    user = db.users.find_one({"email": email})
    
    if not user:
        print(f"❌ Aucun utilisateur trouvé avec l'email: {email}")
        return
    
    print("\n" + "=" * 60)
    print(f"👤 Utilisateur: {user.get('prenom', '')} {user.get('nom', '')}")
    print(f"📧 Email: {email}")
    print("=" * 60)
    
    # Vérifier si un code existe
    if "reset_code" in user:
        reset_code = user["reset_code"]
        expires = user.get("reset_code_expires", 0)
        
        # Vérifier si le code est expiré
        now = datetime.now().timestamp()
        
        if expires > now:
            temps_restant = int((expires - now) / 60)
            print(f"\n✅ CODE DE RÉINITIALISATION: {reset_code}")
            print(f"⏰ Expire dans: {temps_restant} minutes")
        else:
            print(f"\n⚠️  Code expiré: {reset_code}")
            print("💡 Demandez un nouveau code depuis l'application")
    else:
        print("\n❌ Aucun code de réinitialisation trouvé")
        print("💡 Demandez un code depuis l'application (page 'Mot de passe oublié')")
    
    print("=" * 60)

if __name__ == "__main__":
    print("=" * 60)
    print("   AFFICHAGE DU CODE DE RÉINITIALISATION")
    print("=" * 60)
    print()
    voir_code_reset()
