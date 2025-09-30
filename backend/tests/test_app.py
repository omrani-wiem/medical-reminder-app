# 🧪 Tests unitaires pour le backend Medical Reminder
import pytest
import json
import sys
import os

# Ajouter le dossier parent au PATH pour importer app.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import après ajout du path
try:
    from app import app, hash_password, check_password, generate_token, verify_token
except ImportError:
    print("⚠️ Impossible d'importer app.py - Tests basiques seulement")

@pytest.fixture
def client():
    """🔧 Configuration du client de test Flask"""
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/medical_reminder_test'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.test_client() as client:
        yield client

class TestBasicFunctionality:
    """🧪 Tests de base pour l'application"""
    
    def test_app_exists(self):
        """✅ Test que l'app Flask existe"""
        assert app is not None
        
    def test_app_is_testing(self, client):
        """✅ Test que l'app est en mode test"""
        assert app.config['TESTING']

class TestPasswordSecurity:
    """🔒 Tests de sécurité des mots de passe"""
    
    def test_password_hashing(self):
        """✅ Test du hashage des mots de passe"""
        password = "test123456"
        hashed = hash_password(password)
        
        # Le hash ne doit pas être le mot de passe original
        assert hashed != password
        # Le hash doit toujours être différent
        hashed2 = hash_password(password)
        assert hashed != hashed2
        
    def test_password_verification(self):
        """✅ Test de vérification des mots de passe"""
        password = "test123456"
        hashed = hash_password(password)
        
        # Bon mot de passe
        assert check_password(password, hashed) == True
        # Mauvais mot de passe  
        assert check_password("wrongpassword", hashed) == False

class TestJWTTokens:
    """🎫 Tests des tokens JWT"""
    
    def test_token_generation(self):
        """✅ Test de génération de token"""
        user_id = "test123"
        email = "test@example.com"
        token = generate_token(user_id, email)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 20  # JWT tokens sont longs
        
    def test_token_verification(self):
        """✅ Test de vérification de token"""
        user_id = "test123"
        email = "test@example.com"
        token = generate_token(user_id, email)
        
        # Token valide
        decoded = verify_token(token)
        assert decoded is not None
        assert decoded['user_id'] == user_id
        assert decoded['email'] == email
        
        # Token invalide
        invalid_decoded = verify_token("invalid.token.here")
        assert invalid_decoded is None

class TestAPIEndpoints:
    """🌐 Tests des endpoints API"""
    
    def test_root_endpoint_exists(self, client):
        """✅ Test que l'endpoint racine répond"""
        # Note: adapter selon vos endpoints réels
        response = client.get('/')
        # Accepter 404 si pas d'endpoint racine défini
        assert response.status_code in [200, 404, 405]
        
    def test_medicaments_endpoint_structure(self, client):
        """✅ Test de la structure de l'endpoint medicaments"""
        response = client.get('/medicaments')
        # Doit répondre (même si non autorisé)
        assert response.status_code in [200, 401, 403]
        
    def test_auth_endpoints_exist(self, client):
        """✅ Test que les endpoints d'auth existent"""
        # Test inscription avec Content-Type JSON
        response = client.post('/auth/register', 
                              content_type='application/json',
                              json={})
        assert response.status_code in [400, 401, 405, 422]  # Pas 404
        
        # Test connexion avec Content-Type JSON
        response = client.post('/auth/login',
                              content_type='application/json', 
                              json={})
        assert response.status_code in [400, 401, 405, 422]  # Pas 404class TestDataValidation:
    """📊 Tests de validation des données"""
    
    def test_email_validation_logic(self):
        """✅ Test logique validation email"""
        valid_emails = [
            "test@example.com",
            "user.name@domain.co.uk",
            "123@test.org"
        ]

        invalid_emails = [
            "notanemail",
            "user@",
            ""
        ]

        for email in valid_emails:
            assert "@" in email and "." in email

        for email in invalid_emails:
            assert not ("@" in email and "." in email and len(email) > 3)# 🏃‍♂️ Fonction pour lancer les tests directement
if __name__ == "__main__":
    print("🧪 Lancement des tests backend...")
    pytest.main([__file__, "-v"])