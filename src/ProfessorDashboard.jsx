import { useState, useEffect } from 'react';
import NotesTable from './NotesTable';

// Composant qui affiche le dashboard d'un prof
function ProfessorDashboard({ user, notes, onFetch, onLogout, }) {
    const [newNote, setNewNote] = useState({ // Un seul nouvel objet note à saisir, vide par défaut
        studentId: '',
        note: '',
        coefficient: ''
    });

    // Au chargement de la page on charge toutes les notes de la matière du prof avec le useEffect en appelant fetchNotes via onFetch
    useEffect(() => {
        onFetch();
    }, []);

    // Mettre à jour la saisie de la nouvelle note 
    const handleNewNoteChange = (champ, value) => {  // Champ contient la propiété de la note qu'on veut changer et value la valeur qu'on veut lui donnée
        setNewNote({ ...newNote, [champ]: value }); // On copie les anciennes propropriété avec (...) et on remplace la propriété par sa nouvelle valeur
    };

    // Envoyer la nouvelle note à l'API
    const handleSubmitNewNote = async () => {
        await fetch('http://localhost/COMWEB-bernard-marot-adelmard/php/api.php', { // Lance la requette vers l'url
            method: 'POST', // Pour envoyer des infos à l'api et donc à la bdd
            headers: { 'Content-Type': 'application/json' }, // On indique qu'on envoie un JSON
            body: JSON.stringify({ // Body contient ce qu'on envoie au serveur, que l'on transforme en chaine JSON
                action: 'addNotes', // On donne la nature de l'envoie, ici on veut ajouer une note
                matiere: user.matiere, // pour tel matière
                notes: [newNote]  // on envoie un tableau de la nouvelle note
            })
        });
        setNewNote({ studentId: '', note: '', coefficient: '' }); // On réinitinialise les champs de newNotes
        onFetch(); // Appel à fetchNotes pour charger sur la page les nouvelle notes avec les anciennes
    };

    // Affichage de la page
    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h1>
                Bonjour {user.prenom} {user.nom} (Professeur – {user.matiere})
            </h1>
            <button
                onClick={onLogout}
                style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
            >
                Se déconnecter
            </button>

            {/* Tableau des notes existantes (non modifiable) */}
            <h2>Notes existantes</h2>
            <NotesTable // Appel du composant qui affiche le tableau des notes
                notes={notes}
                showStudentName // On précise qu'on veut voir les noms de l'étudiants plutot que les matières
            />

            {/* Formulaire d'ajout d'une seule note */}
            <div style={{ marginTop: '2rem' }}>
                <h2>Ajouter une note</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input // entré de texte pour l'id de l'élève
                        type="text"
                        placeholder="ID élève"
                        value={newNote.studentId} // 
                        onChange={e => handleNewNoteChange('studentId', e.target.value)}
                        style={{ padding: '0.5rem', width: '100px' }}
                    />
                    <input // Sa note
                        type="number"
                        placeholder="Note"
                        value={newNote.note}
                        onChange={e => handleNewNoteChange('note', e.target.value)}
                        style={{ padding: '0.5rem', width: '80px' }}
                    />
                    <input // Son coeff
                        type="number"
                        placeholder="Coefficient"
                        value={newNote.coefficient}
                        onChange={e => handleNewNoteChange('coefficient', e.target.value)}
                        style={{ padding: '0.5rem', width: '80px' }}
                    />
                </div>
                <button
                    onClick={handleSubmitNewNote}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Enregistrer la note
                </button>
            </div>
        </div>
    );
}

export default ProfessorDashboard;
