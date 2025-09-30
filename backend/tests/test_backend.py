# 🧪 Tests pour l'application Flask
# Tests de base pour vérifier que l'application fonctionne

import pytest
import sys
import os
import json

# Ajouter le répertoire parent au path pour importer app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

@pytest.fixture
def client():
    """Fixture pour créer un client de test Flask"""
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/medical_reminder_test'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.test_client() as client:
        with app.app_context():
            yield client

class TestBasicRoutes:
    """Tests de base pour les routes principales"""
    
    def test_app_exists(self, client):
        """Test que l'application existe et démarre"""
        assert app is not None
    
    def test_app_is_testing(self, client):
        """Test que l'application est en mode test"""
        assert app.config['TESTING']

class TestAuthRoutes:
    """Tests pour les routes d'authentification"""
    
    def test_register_route_exists(self, client):
        """Test que la route d'inscription existe"""
        response = client.post('/auth/register')
        # Devrait retourner 400 (données manquantes) plutôt que 404 (route inexistante)
        assert response.status_code != 404
    
    def test_login_route_exists(self, client):
        """Test que la route de connexion existe"""
        response = client.post('/auth/login')
        # Devrait retourner 400 (données manquantes) plutôt que 404 (route inexistante)
        assert response.status_code != 404
    
    def test_register_missing_data(self, client):
        """Test inscription avec données manquantes"""
        response = client.post('/auth/register', 
                             json={},
                             content_type='application/json')
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

class TestMedicamentRoutes:
    """Tests pour les routes des médicaments"""
    
    def test_medicaments_route_requires_auth(self, client):
        """Test que la route médicaments nécessite une authentification"""
        response = client.get('/medicaments')
        # Devrait retourner 401 (non autorisé) car pas de token
        assert response.status_code == 401

class TestEmailRoute:
    """Tests pour la route de test d'email"""
    
    def test_test_email_route_exists(self, client):
        """Test que la route de test email existe"""
        response = client.post('/test-email')
        # Route existe mais nécessite authentification
        assert response.status_code != 404