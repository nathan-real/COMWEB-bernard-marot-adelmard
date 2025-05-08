import { useState, useEffect } from 'react';
import NotesTable from './NotesTable';

function ProfessorDashboard({ user, onLogout }) {
    // Notes existantes
    const [notes, setNotes] = useState([]);

    // Un seul nouvel objet note à saisir
    const [newNote, setNewNote] = useState({
        studentId: '',
        note: '',
        coefficient: ''
    });

    // Au montage, on charge toutes les notes de la matière du prof
    useEffect(() => {
        fetchNotes();
    }, []);

    // Récupérer les notes de la classe pour la matière du prof
    const fetchNotes = async () => {
        try {
            const url = new URL('http://localhost/COMWEB-bernard-marot-adelmard/php/api.php');
            url.searchParams.set('action', 'profNotes');
            url.searchParams.set('matiere', user.matiere);

            const resp = await fetch(url.toString());
            const data = await resp.json();
            setNotes(data);
        } catch {
            setNotes([]);
        }
    };

    // Mettre à jour la saisie de la nouvelle note
    const handleNewNoteChange = (field, value) => {
        setNewNote(prev => ({ ...prev, [field]: value }));
    };

    // Envoyer la nouvelle note à l'API
    const handleSubmitNewNote = async () => {
        try {
            await fetch('http://localhost/COMWEB-bernard-marot-adelmard/php/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'addNotes',
                    matiere: user.matiere,
                    notes: [newNote]  // on envoie un tableau d'une seule note
                })
            });
            // Réinitialiser le formulaire et recharger
            setNewNote({ studentId: '', note: '', coefficient: '' });
            fetchNotes();
        } catch {
            // silent fail
        }
    };

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
            <NotesTable
                notes={notes}
                showStudentName
            />

            {/* Formulaire d'ajout d'une seule note */}
            <div style={{ marginTop: '2rem' }}>
                <h2>Ajouter une note</h2>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="ID élève"
                        value={newNote.studentId}
                        onChange={e => handleNewNoteChange('studentId', e.target.value)}
                        style={{ padding: '0.5rem', width: '100px' }}
                    />
                    <input
                        type="number"
                        placeholder="Note"
                        value={newNote.note}
                        onChange={e => handleNewNoteChange('note', e.target.value)}
                        style={{ padding: '0.5rem', width: '80px' }}
                    />
                    <input
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
