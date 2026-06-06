import {useState}  from 'react';
import { useNavigate  } from 'react-router-dom';
import { ajouterMedicament } from '../services/medicamentsService';

const INITIAL_FORM = {
    nom: '', dosage: '', forme: 'Comprimé', couleur: '',
  frequence: '', duree: '', stock: '', stockMin: '',
  medecin: '', dateDebut: '', dateFin: '', instructions: ''
};


export const useAjouterMedicament =() =>{
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]:value }));

    };

 
    const goToMedicaments = () => {
        localStorage.setItem('dashboardActiveTab', 'medicaments');
        navigate('/dashboard');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.nom || !formData.dosage ) {
            setError('Veuillez remplir les champs obligatoires (nom et dosage)');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');


        if (!user || !token) {
            navigate('/login');
            return;
        }

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

     try {
      setLoading(true);
      await ajouterMedicament(medicamentData, token);
      goToMedicaments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { formData, handleInputChange, handleSubmit, goToMedicaments, loading, error };
};