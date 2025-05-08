// NotesTable.jsx
function NotesTable({ notes, showStudentName = false }) { // Le booléen c'est pour affichage prof ou non
    if (notes.length === 0) {
        return <p>Aucune note à afficher.</p>;
    }
    return (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    {/* Colonne dynamique : Élève ou Matière */}
                    {showStudentName ? <th>Élève</th> : <th>Matière</th>}
                    <th>Note</th>
                    <th>Coef.</th>
                </tr>
            </thead>
            <tbody>
                {notes.map((n, i) => ( // on parcourt chaque éléments du tableau notes, n est la note avec toutes la caractéristiques
                    <tr key={i}>
                        {/* Valeur dynamique selon showStudentName */}
                        <td>{showStudentName ? n.nom_eleve : n.matiere}</td>
                        <td>{n.note}</td>
                        <td>{n.coefficient}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default NotesTable;
  