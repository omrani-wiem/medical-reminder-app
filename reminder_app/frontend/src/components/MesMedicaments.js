import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MesMedicaments.css';

const MesMedicaments = () => {
  const { t } = useTranslation();
  const [medicaments, setMedicaments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    dosage: '',
    forme: 'Comprimé',
    couleur: '',
    frequence: '',
    duree: '',
    stock: '',
    stockMin: '',
    medecin: '',
    dateDebut: '',
    dateFin: '',
    instructions: ''
  });

  // Récupérer les médicaments depuis le backend
  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.email) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/medicaments?email=${user.email}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des médicaments');
      }

      const data = await response.json();
      setMedicaments(data);
      setError('');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les médicaments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!user || !token) {
        alert('Vous devez être connecté');
        return;
      }

      const medicamentData = {
        nom: formData.nom,
        dose: formData.dosage,
        forme: formData.forme,
        couleur: formData.couleur,
        frequence: formData.frequence,
        heure: formData.prochainePrise || '08:00',
        duree: formData.duree,
        stock: parseInt(formData.stock) || 0,
        stockMin: parseInt(formData.stockMin) || 0,
        medecin: formData.medecin,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        instructions: formData.instructions,
        email: user.email,
        userId: user.id
      };

      if (editingMed) {
        // TODO: Implémenter la modification (PUT endpoint)
        alert('La modification sera implémentée prochainement');
        setEditingMed(null);
      } else {
        // Ajouter un nouveau médicament
        const response = await fetch('http://localhost:5000/medicaments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(medicamentData)
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du médicament');
        }

        // Recharger la liste
        await fetchMedicaments();
        alert('Médicament ajouté avec succès !');
      }

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        dosage: '',
        forme: 'Comprimé',
        couleur: '',
        frequence: '',
        duree: '',
        stock: '',
        stockMin: '',
        medecin: '',
        dateDebut: '',
        dateFin: '',
        instructions: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout du médicament');
    }
  };

  const handleEdit = (medicament) => {
    setFormData(medicament);
    setEditingMed(medicament);
    setShowAddForm(true);
  };

  const handleDelete = async (medicament) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      try {
        // TODO: Implémenter DELETE endpoint dans le backend
        alert('La suppression sera implémentée prochainement');
        // Pour l'instant, on recharge juste la liste
        await fetchMedicaments();
      } catch (err) {
        console.error('Erreur:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStockStatus = (stock, stockMin) => {
    if (stock === 0) return 'epuise';
    if (stock <= stockMin) return 'faible';
    return 'normal';
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'epuise': return '#e74c3c';
      case 'faible': return '#f39c12';
      default: return '#27ae60';
    }
  };

  // Filtrage des médicaments
  const medicamentsFiltres = medicaments.filter(med => {
    const matchSearch = med.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       med.medecin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchFilter = filterType === 'tous' || 
                       (filterType === 'faible-stock' && med.stock <= med.stockMin) ||
                       (filterType === 'epuise' && med.stock === 0);
    
    return matchSearch && matchFilter;
  });

  return (
    <div className="mes-medicaments">
      <div className="medicaments-header">
        <div className="header-top">
          <h1>{t('medications.title')} 💊</h1>
          <button 
            className="btn-add-medicament"
            onClick={() => {
              setShowAddForm(true);
              setEditingMed(null);
              setFormData({
                nom: '',
                dosage: '',
                forme: 'Comprimé',
                couleur: '',
                frequence: '',
                duree: '',
                stock: '',
                stockMin: '',
                medecin: '',
                dateDebut: '',
                dateFin: '',
                instructions: ''
              });
            }}
          >
            ➕ {t('medications.add')}
          </button>
        </div>
        
        <div className="medicaments-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder={t('medications.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="tous">{t('medications.filterAll')}</option>
              <option value="faible-stock">{t('medications.filterLowStock')}</option>
              <option value="epuise">{t('medications.filterOutOfStock')}</option>
            </select>
          </div>
        </div>

        <div className="medicaments-stats">
          <div className="stat-card">
            <div className="stat-number">{medicaments.length}</div>
            <div className="stat-label">{t('common.total')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{medicaments.filter(m => m.stock <= m.stockMin).length}</div>
            <div className="stat-label">{t('medications.filterLowStock')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{medicaments.filter(m => m.stock === 0).length}</div>
            <div className="stat-label">{t('medications.filterOutOfStock')}</div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMed ? t('medications.edit') : t('medications.addNew')}</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMed(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="medicament-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.medicationName')} *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('medications.dosageLabel')} *</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder={t('medications.dosagePlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.formLabel')}</label>
                  <select
                    name="forme"
                    value={formData.forme}
                    onChange={handleInputChange}
                  >
                    <option value="Comprimé">{t('medications.tablet')}</option>
                    <option value="Gélule">{t('medications.capsule')}</option>
                    <option value="Sirop">{t('medications.syrup')}</option>
                    <option value="Injection">{t('medications.injection')}</option>
                    <option value="Pommade">{t('medications.cream')}</option>
                    <option value="Gouttes">{t('medications.drops')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('medications.color')}</label>
                  <input
                    type="text"
                    name="couleur"
                    value={formData.couleur}
                    onChange={handleInputChange}
                    placeholder={t('medications.colorPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.frequencyLabel')} *</label>
                  <input
                    type="text"
                    name="frequence"
                    value={formData.frequence}
                    onChange={handleInputChange}
                    placeholder={t('medications.durationPlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('medications.duration')} *</label>
                  <input
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleInputChange}
                    placeholder={t('medications.durationPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.currentStock')}</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>{t('medications.minStock')}</label>
                  <input
                    type="number"
                    name="stockMin"
                    value={formData.stockMin}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.prescribingDoctor')}</label>
                  <input
                    type="text"
                    name="medecin"
                    value={formData.medecin}
                    onChange={handleInputChange}
                    placeholder={t('medications.doctorPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.startDate')}</label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{t('medications.endDate')}</label>
                  <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('medications.instructions')}</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={t('medications.instructionsPlaceholder')}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  {editingMed ? t('common.save') : t('common.add')}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMed(null);
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau des médicaments */}
      <div className="medicaments-table-container">
        <table className="medicaments-table">
          <thead>
            <tr>
              <th>{t('medications.name')}</th>
              <th>{t('medications.dosage')}</th>
              <th>{t('medications.frequency')}</th>
              <th>{t('medications.duration')}</th>
              <th>{t('medications.doctor')}</th>
              <th>{t('medications.stock')}</th>
              <th>{t('medications.nextDose')}</th>
              <th>{t('medications.instructions')}</th>
              <th>{t('medications.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {medicamentsFiltres.map(medicament => {
              const stockStatus = getStockStatus(medicament.stock, medicament.stockMin);
              return (
                <tr key={medicament.id}>
                  <td className="medicament-name-cell">
                    <strong>{medicament.nom}</strong>
                  </td>
                  <td className="dosage-cell">
                    <div>{medicament.dosage}</div>
                    <div className="forme-info">{medicament.forme} {medicament.couleur}</div>
                  </td>
                  <td className="frequence-cell">{medicament.frequence}</td>
                  <td className="duree-cell">{medicament.duree}</td>
                  <td className="medecin-cell">{medicament.medecin}</td>
                  <td className="stock-cell">
                    <div 
                      className="stock-value"
                      style={{ color: getStockColor(stockStatus) }}
                    >
                      {medicament.stock} unités
                    </div>
                    <div className={`stock-status-badge ${stockStatus}`}>
                      {stockStatus === 'epuise' && '🔴 Épuisé'}
                      {stockStatus === 'faible' && '🟡 Stock faible'}
                      {stockStatus === 'normal' && '🟢 Stock OK'}
                    </div>
                  </td>
                  <td className="prochaine-prise-cell">
                    {medicament.prochainePrise || '-'}
                  </td>
                  <td className="instructions-cell">
                    <div className="instructions-text-table">
                      {medicament.instructions || '-'}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit-table"
                      onClick={() => handleEdit(medicament)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete-table"
                      onClick={() => handleDelete(medicament.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {medicamentsFiltres.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">💊</div>
          <h3>Aucun médicament trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou ajoutez un nouveau médicament.</p>
        </div>
      )}
    </div>
  );
};

export default MesMedicaments;