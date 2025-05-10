import React, { useState, useEffect } from 'react';

// Composant pour le formulaire de connexion
function LoginForm({ onLogin }) {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // évite le rafraichissement automatique de la pagex 
    onLogin({ identifiant, mot_de_passe: motDePasse });
  };

  return (
    <div style={{ padding: '2rem',
    fontFamily: 'Arial', 
    display: 'flex', 
    justifyContent: 'center', 
    flexDirection: 'column',
    alignItems: 'center',
     
    }}>

      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Identifiant"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '300px' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginForm;