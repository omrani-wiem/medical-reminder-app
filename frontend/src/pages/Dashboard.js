import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [nom, setNom] = useState("");
  const [dose, setDose] = useState("");
  const [heure, setHeure] = useState("");
  const [frequence, setFrequence] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const { t, changeLanguage, currentLanguage, availableLanguages } = useLanguage();

  // Vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    verifyToken(token);
    
    if (userEmail) {
      setEmail(userEmail);
    }
    
    loadMedicaments();
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        localStorage.clear();
        navigate('/login');
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const loadMedicaments = () => {
    const token = localStorage.getItem('userToken');
    
    fetch("http://127.0.0.1:5000/medicaments", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMedicaments(data);
        } else {
          console.error("Erreur:", data);
          setMessage("❌ Erreur lors du chargement des médicaments");
        }
      })
      .catch(err => {
        console.error("Erreur:", err);
        setMessage("❌ Impossible de se connecter au serveur");
      });
  };

  const addMedicament = () => {
    if (!nom || !dose || !heure || !frequence || !email) {
      setMessage("❌ Tous les champs sont requis");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("❌ Format d'email invalide");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem('userToken');
    
    fetch("http://127.0.0.1:5000/medicaments", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ nom, dose, heure, frequence, email })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setMessage(`❌ ${data.error}`);
        } else {
          setMessage("✅ Médicament ajouté avec succès!");
          loadMedicaments();
          setNom("");
          setDose("");
          setHeure("");
          setFrequence("");
        }
      })
      .catch(err => {
        setLoading(false);
        console.error("Erreur:", err);
        setMessage("❌ Erreur lors de l'ajout");
      });
  };

  const testEmail = () => {
    if (!email) {
      setMessage("❌ Veuillez entrer un email pour le test");
      return;
    }

    setLoading(true);
    setMessage("📧 Envoi d'email de test...");

    const token = localStorage.getItem('userToken');
    
    fetch("http://127.0.0.1:5000/test-email", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setMessage(`❌ ${data.error}`);
        } else {
          setMessage(`✅ ${data.message}`);
        }
      })
      .catch(err => {
        setLoading(false);
        console.error("Erreur:", err);
        setMessage("❌ Erreur lors de l'envoi du test");
      });
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  const sidebarStyle = {
    width: '250px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: 'white',
    padding: '20px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000
  };

  const navItemStyle = (isActive) => ({
    padding: '15px 20px',
    margin: '5px 0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
    transform: isActive ? 'translateX(5px)' : 'translateX(0)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px'
  });

  const contentStyle = {
    marginLeft: '250px',
    padding: '20px',
    background: '#f5f7fa',
    minHeight: '100vh'
  };

  const renderSidebar = () => (
    <div style={sidebarStyle}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        paddingBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          💊 Medical App
        </h2>
        <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
          Bienvenue, {userName || 'Utilisateur'}
        </p>
      </div>

      <nav>
        {[
          { id: 'overview', icon: '📊', label: 'Vue d\'ensemble' },
          { id: 'medicaments', icon: '💊', label: 'Mes Médicaments' },
          { id: 'statistics', icon: '📈', label: 'Statistiques' },
          { id: 'profil', icon: '👤', label: 'Mon Profil' },
          { id: 'parametres', icon: '⚙️', label: 'Paramètres' }
        ].map(item => (
          <div
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={navItemStyle(activeSection === item.id)}
            onMouseEnter={(e) => {
              if (activeSection !== item.id) {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateX(3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== item.id) {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#333' }}>
        📊 Vue d'ensemble
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', opacity: 0.9 }}>
            Médicaments Enregistrés
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {medicaments.length}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '30px',
          borderRadius: '15px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', opacity: 0.9 }}>
            Prochaines Prises
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {medicaments.length}
          </p>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333', fontSize: '20px' }}>
          📋 Rappels du jour
        </h3>
        {medicaments.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            Aucun médicament enregistré. Ajoutez votre premier médicament dans la section "Mes Médicaments".
          </p>
        ) : (
          <div>
            {medicaments.map((med, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 20px',
                marginBottom: '10px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '4px solid #667eea'
              }}>
                <div>
                  <strong style={{ color: '#333', fontSize: '16px' }}>{med.nom}</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                    {med.dose} - {med.frequence}
                  </p>
                </div>
                <div style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {med.heure}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicaments = () => (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>
        💊 Mes Médicaments
      </h1>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          Ajouter un nouveau médicament
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du médicament"
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="Dosage (ex: 500mg)"
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <input
            type="time"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <select
            value={frequence}
            onChange={(e) => setFrequence(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="">Fréquence</option>
            <option value="Une fois par jour">Une fois par jour</option>
            <option value="Deux fois par jour">Deux fois par jour</option>
            <option value="Trois fois par jour">Trois fois par jour</option>
            <option value="Selon besoin">Selon besoin</option>
          </select>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email de notification"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            marginBottom: '15px'
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={addMedicament}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter Médicament'}
          </button>
          
          <button
            onClick={testEmail}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Tester Email
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '20px',
          borderRadius: '5px',
          background: message.includes('❌') ? '#f8d7da' : '#d4edda',
          color: message.includes('❌') ? '#721c24' : '#155724',
          border: `1px solid ${message.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {message}
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>
          Médicaments enregistrés ({medicaments.length})
        </h3>
        
        {medicaments.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            Aucun médicament enregistré pour le moment.
          </p>
        ) : (
          <div>
            {medicaments.map((med, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                marginBottom: '10px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{med.nom}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    {med.dose} • {med.frequence} • {med.email}
                  </p>
                </div>
                <div style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {med.heure}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'medicaments':
        return renderMedicaments();
      case 'statistics':
        return <div><h1>📈 Statistiques</h1><p>Section en développement...</p></div>;
      case 'profil':
        return <div><h1>👤 Mon Profil</h1><p>Section en développement...</p></div>;
      case 'parametres':
        return <div><h1>⚙️ Paramètres</h1><p>Section en développement...</p></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f7fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {renderSidebar()}
      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;