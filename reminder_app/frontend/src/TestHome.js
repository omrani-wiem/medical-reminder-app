import React from 'react';

function TestHome() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1e3a8a', fontSize: '3rem' }}>
        🎉 Success! Medical Reminder App is Working! 🎉
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#64748b', marginTop: '30px' }}>
        Your React application is now running correctly on Vite!
      </p>
      <div style={{ marginTop: '40px' }}>
        <button style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
}

export default TestHome;