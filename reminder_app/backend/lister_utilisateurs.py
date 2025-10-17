"""
Script pour lister tous les utilisateurs dans la base de données
"""
from pymongo import MongoClient
import os

# Connexion MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/medical_reminder")
client = MongoClient(mongo_uri)
db = client["medical_reminder"]

def lister_utilisateurs():
    """Liste tous les utilisateurs dans la base"""
    
    users = list(db.users.find({}, {"_id": 0, "password": 0, "reset_code": 0}))
    
    if not users:
        print("❌ Aucun utilisateur dans la base de données")
        print("\n💡 Vous devez d'abord créer un compte via l'application:")
        print("   → Allez sur http://localhost:3000/register")
        print("   → Créez un compte avec omraniwiem62@gmail.com")
        return
    
    print(f"\n✅ {len(users)} utilisateur(s) trouvé(s):\n")
    print("=" * 70)
    
    for i, user in enumerate(users, 1):
        print(f"\n{i}. {user.get('prenom', '')} {user.get('nom', '')}")
        print(f"   📧 Email: {user.get('email', '')}")
        if 'reset_code' in user:
            print(f"   🔐 Code reset actif: Oui")
        else:
            print(f"   🔐 Code reset actif: Non")
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    print("=" * 70)
    print("   LISTE DES UTILISATEURS - MEDICAL REMINDER")
    print("=" * 70)
    lister_utilisateurs()
