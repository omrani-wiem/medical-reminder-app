import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:5001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Stocker les informations de l'utilisateur
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userName', data.user.name);
                
                setMessage('✅ Connexion réussie ! Redirection...');
                
                // Rediriger vers le dashboard après un court délai
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setMessage('❌ Erreur de connexion au serveur');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ 
                color: '#333',
                marginBottom: '30px',
                fontSize: '28px'
            }}>
                🔐 Connexion
            </h1>
            
            <form onSubmit={handleSubmit} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    style={{
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        padding: '12px',
                        background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: message.includes('❌') ? '#f8d7da' : '#d4edda',
                    color: message.includes('❌') ? '#721c24' : '#155724',
                    border: `1px solid ${message.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`
                }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '20px', color: '#666' }}>
                <p>Pas encore de compte ? 
                    <button 
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginLeft: '5px'
                        }}
                    >
                        S'inscrire
                    </button>
                </p>
            </div>

            <div style={{ 
                marginTop: '30px', 
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#666'
            }}>
                <strong>Compte de test :</strong><br/>
                Email: test@test.com<br/>
                Mot de passe: test123
            </div>
        </div>
    );
}

export default Login;
