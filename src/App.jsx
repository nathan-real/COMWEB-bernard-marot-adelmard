import { useState, useEffect } from 'react';

function App() {
  // États généraux
  const [user, setUser] = useState(null);

  // États du formulaire de login
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  // États pour affichage des notes
  const [notes, setNotes] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Fonction de login
  const handleLogin = async (e) => {
    e.preventDefault();

    const resp = await fetch('http://localhost/COMWEB-bernard-marot-adelmard/php/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiant, mot_de_passe: motDePasse }),
    });

    const userData = await resp.json();
    setUser(userData);
  };

  // Récupérer les notes
  const fetchNotes = async (param) => {
    const resp = await fetch(
      `http://localhost/COMWEB-bernard-marot-adelmard/php/api.php?url=${encodeURIComponent(param)}` //encodage du paramètre (pour éviter les problèmes si param contient des espaces ou caractères spéciaux)
    );
    const data = await resp.json();
    setNotes(data);
  };

  // Charger automatiquement pour un élève quand il se connecte 
  useEffect(() => {
    if (user && user.type === 'eleve') { // On vérifie si c'est bien un élève qui se connecte et quon a bien un user
      fetchNotes(user.id);
    }
  }, [user]);

  // Déconnexion
  const handleLogout = () => {
    setUser(null);
    setIdentifiant('');
    setMotDePasse('');
    setNotes([]);
    setSearchInput('');
  };

  // Rendu conditionnel
  if (!user) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Connexion</h1>
        <form onSubmit={handleLogin}>
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

  // --- Écran principal ---
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>
        Bonjour {user.prenom} {user.nom} ({user.type === 'eleve' ? 'Élève' : 'Professeur'})
      </h1>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Se déconnecter
      </button>

      {user.type === 'prof' && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Rechercher un élève</h2>
          <input
            type="text"
            placeholder="ID ou identifiant"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
          />
          <button onClick={() => fetchNotes(searchInput)} style={{ padding: '0.5rem 1rem' }}>
            Chercher
          </button>
        </div>
      )}

      <h2>Notes</h2>
      {!notes.length && <p>Aucune note à afficher.</p>}
      {notes.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Matière</th>
              <th>Note</th>
              <th>Coef.</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n, i) => (
              <tr key={i}>
                <td>{n.nom_eleve}</td>
                <td>{n.matiere}</td>
                <td>{n.note}</td>
                <td>{n.coefficient}</td>
                <td>{n.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
