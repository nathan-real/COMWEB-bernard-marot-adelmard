import React, { useState, useEffect } from 'react';

// Composant pour le formulaire de connexion
function LoginForm({ onLogin }) {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ identifiant, mot_de_passe: motDePasse });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
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

// Composant pour afficher les notes sous forme de tableau
function NotesTable({ notes }) {
  if (notes.length === 0) {
    return <p>Aucune note à afficher.</p>;
  }
  return (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Matière</th>
          <th>Note</th>
          <th>Coef.</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {notes.map((n, i) => (
          <tr key={i}>
            <td>{n.matiere}</td>
            <td>{n.note}</td>
            <td>{n.coefficient}</td>
            <td>{n.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Composant spécifique pour le tableau de bord élève
function StudentDashboard({ user, notes, onLogout }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>
        Bonjour {user.prenom} {user.nom} (Élève)
      </h1>
      <button onClick={onLogout} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        Se déconnecter
      </button>
      <h2>Mes notes</h2>
      <NotesTable notes={notes} />
    </div>
  );
}

// Composant spécifique pour le tableau de bord professeur
function ProfessorDashboard({ user, notes, onFetch, onLogout, searchInput, setSearchInput }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>
        Bonjour {user.prenom} {user.nom} (Professeur)
      </h1>
      <button onClick={onLogout} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        Se déconnecter
      </button>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Rechercher un élève</h2>
        <input
          type="text"
          placeholder="ID ou identifiant"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />
        <button onClick={() => onFetch(searchInput)} style={{ padding: '0.5rem 1rem' }}>
          Chercher
        </button>
      </div>
      <h2>Notes de l'élève</h2>
      <NotesTable notes={notes} />
    </div>
  );
}

// Composant principal App
function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Fonction de login
  const handleLogin = async (credentials) => {
    const resp = await fetch(
      'http://localhost/COMWEB-bernard-marot-adelmard/php/login.php',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }
    );
    const userData = await resp.json();
    setUser(userData);
  };

  // Récupérer les notes
  const fetchNotes = async (param) => {
    const resp = await fetch(
      `http://localhost/COMWEB-bernard-marot-adelmard/php/api.php?url=${encodeURIComponent(param)}`
    );
    const data = await resp.json();
    setNotes(data);
  };

  // Effet pour charger automatiquement les notes d'un élève
  useEffect(() => {
    if (user && user.type === 'eleve') {
      fetchNotes(user.id);
    }
  }, [user]);

  // Déconnexion
  const handleLogout = () => {
    setUser(null);
    setNotes([]);
    setSearchInput('');
  };

  // Rendu
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.type === 'eleve') {
    return (
      <StudentDashboard
        user={user}
        notes={notes}
        onLogout={handleLogout}
      />
    );
  }

  // Si c’est un professeur, on affiche son dashboard
  if (user.type === 'prof') {
    return (
      <ProfessorDashboard
        user={user}
        notes={notes}
        onFetch={fetchNotes}
        onLogout={handleLogout}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    );
  }
}

export default App;
