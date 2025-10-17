import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AjoutMedicament.css';

function AjoutMedicament() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        dosage: '',
        forme:'Comprimé',
        couleur: '',
        frequence: '',
        duree:'',
        stock:'',
        stockMin: '',
        medecin: '',
        dateDebut: '',
        dateFin: '',
        instructions: ''
  });

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation basique
    if (!formData.nom || !formData.dosage) {
      alert('Veuillez remplir les champs obligatoires (nom et dosage)');
      return;
    }

    try {
      // Récupérer l'utilisateur connecté
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!user || !token) {
        alert('Vous devez être connecté pour ajouter un médicament');
        navigate('/login');
        return;
      }

      // Préparer les données à envoyer
      const medicamentData = {
        nom: formData.nom,
        dose: formData.dosage,
        forme: formData.forme,
        couleur: formData.couleur,
        frequence: formData.frequence || '1x/jour',
        heure: '08:00',
         duree: formData.duree,
        stock: formData.stock,
        stockMin: formData.stockMin,
        medecin: formData.medecin,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        instructions: formData.instructions,
        email: user.email,
        userId: user.id
      };

      // Envoyer au backend
      const response = await fetch('http://localhost:5000/medicaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicamentData)
      });
      const data = await response.json();

      if (response.ok) {
        alert('Médicament ajouté avec succès !');
        navigate('/dashboard/medicaments');
      } else {
        alert(data.error || 'Erreur lors de l\'ajout du médicament');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="ajout-medicament-page">
    <div className="page-header">
        <button
            className="btn-back"
            onClick={() => navigate('/dasheboard/medicaments')}
        >
           ← Retour
        </button>
        <h1>Ajouter un nouveau médicament</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="medicament-form">
          <div className="form-section">
            <h3>Informations générales</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Nom du médicament *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Ex: Doliprane"
                  required
                />
                 </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  placeholder="Ex: 500mg"
                  required
                />
              </div>
            </div>
             <div className="form-row">
              <div className="form-group">
                <label>Forme</label>
                <select
                  name="forme"
                  value={formData.forme}
                  onChange={handleInputChange}
                >
                  <option value="Comprimé">Comprimé</option>
                  <option value="Gélule">Gélule</option>
                  <option value="Sirop">Sirop</option>
                  <option value="Injection">Injection</option>
                  <option value="Pommade">Pommade</option>
                  <option value="Gouttes">Gouttes</option>
                </select>
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <input
                  type="text"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
                  placeholder="Ex: Blanc"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Fréquence et durée</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Fréquence</label>
                <select
                  name="frequence"
                  value={formData.frequence}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner...</option>
                  <option value="1x/jour">1 fois par jour</option>
                  <option value="2x/jour">2 fois par jour</option>
                  <option value="3x/jour">3 fois par jour</option>
                  <option value="4x/jour">4 fois par jour</option>
                  <option value="si-besoin">Si besoin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Durée (jours)</label>
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleInputChange}
                  placeholder="Ex: 7"
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date de début</label>
                <input
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Date de fin</label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Gestion du stock</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Stock actuel</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ex: 30"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Stock minimum</label>
                <input
                  type="number"
                  name="stockMin"
                  value={formData.stockMin}
                  onChange={handleInputChange}
                  placeholder="Ex: 5"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Informations médicales</h3>

            <div className="form-group">
              <label>Médecin prescripteur</label>
              <input
                type="text"
                name="medecin"
                value={formData.medecin}
                onChange={handleInputChange}
                placeholder="Dr. Dupont"
              />
            </div>

            <div className="form-group">
              <label>Instructions spéciales</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Ex: À prendre avec de l'eau, éviter l'alcool..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard/medicaments')}
            >
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Ajouter le médicament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutMedicament;