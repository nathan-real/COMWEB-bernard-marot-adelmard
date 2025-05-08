import NotesTable from './NotesTable';

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

export default StudentDashboard;