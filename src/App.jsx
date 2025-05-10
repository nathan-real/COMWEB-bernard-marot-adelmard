import React, { useState, useEffect } from 'react';
import ProfessorDashboard from './ProfessorDashboard';
import StudentDashboard from './StudentDashboard';
import LoginForm from './LoginForm';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  // Login
  const handleLogin = async (data) => {
    const resp = await fetch(
      'http://localhost/COMWEB-bernard-marot-adelmard/php/login.php',
      {
        method: 'POST', // On indique la méthode d'envoie des données
        headers: { 'Content-Type': 'application/json' }, // on dit qu'on envoie du JSON
        body: JSON.stringify(data), // Conversion du contenu en json puis envoie
      }
    );
    const userData = await resp.json();
    if (userData === "erreur") { 
      console.log("Erreur de connexion");
    }
    else
      setUser(userData);
  };

  // Récupération des notes en fonction de la nature de l'utilisateur
  const fetchNotes = async (id = '') => {
    let url;
    if (user?.type === 'prof') { // Comme en c#, on indique que ça peut être null. On vérifie si cest un prof
      // pour un prof : toutes les notes de sa matière
      url = `http://localhost/COMWEB-bernard-marot-adelmard/php/api.php`
        + `?action=profNotes`
        + `&matiere=${encodeURIComponent(user.matiere)}`;
    } else {
      // pour un élève
      url = `http://localhost/COMWEB-bernard-marot-adelmard/php/api.php?id=${encodeURIComponent(id)}`;
    }

    const resp = await fetch(url); // lance une requette avec le lien qu'on a construit
    const data = await resp.json(); //Récupération des data
    setNotes(data);
  };

  // Au login, si c’est un élève on charge directement ses notes
  useEffect(() => { // Si la valeur de [user] change, ça déclenche le useEffect qui vient appelé fetchNotes
    if (user && user.type === 'eleve') {
      fetchNotes(user.id);
    }
  }, [user]);

  // Déconnexion
  const handleLogout = () => { // On remplace toutes les variable par leurs valeurs par défault
    setUser(null);
    setNotes([]);
  };

  // Rendu conditionnel en fonction de la nature de l'utilisateur
  if (!user) { // Si ya pas d'user on renvoie la page de login
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.type === 'eleve') { // Si c'est un élève on appel le composant StudentDashboard avec les bons paramètres
    return (
      <StudentDashboard
        user={user}
        notes={notes}
        onLogout={handleLogout}
      />
    );
  }

  // Sinon c'est un prof donc même chose ici. 
  return (
    <ProfessorDashboard
      user={user}
      notes={notes}
      onFetch={fetchNotes}
      onLogout={handleLogout}
    />
  );
}

export default App;
