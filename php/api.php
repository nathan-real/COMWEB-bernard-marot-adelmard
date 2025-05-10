<?php
// Réponse au pré-flight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

// Headers pour les vraies requêtes
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Connexion
$host = '127.0.0.1';
$dbname = 'projetnote';
$username = 'root';
$password = '';
try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erreur' => 'Erreur de connexion à la base']);
    exit;
}

// GET action=profNotes pour voir les notes en tant que prof
if (isset($_GET['action']) && $_GET['action'] === 'profNotes') { // On vérifie si on a bien action=qqc dans l'url + on vérifie que l'action est bien profNotes    
   if (isset($_GET['matiere'])) { // Même chose pour matière
        $matiere = $_GET['matiere'];
    }
    // On prépare la requette qui récupère les données qu'on veut
    $stmt = $bdd->prepare("
    SELECT 
        n.id,
        u.id AS eleve_id,                          -- <-- ajouté
        CONCAT(u.prenom,' ',u.nom) AS nom_eleve,
        n.matiere,
        n.note,
        n.coefficient
    FROM notes n
    JOIN utilisateurs u ON n.eleve_id = u.id
    WHERE n.matiere = :matiere
");// :matière est un placeholder, on lui donne la valeur après car on l'a pas tant qu'on a pas le contenu de l'url
    $stmt->execute(['matiere' => $matiere]); // On exécute la requête en passant le paramètre matière
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); // On récupère les lignes et on les convertit en json puis on envoie au front de react
    exit;
}

// POST addNotes pour ajouter une note en tant que prof
if ($_SERVER['REQUEST_METHOD'] === 'POST') { // on vérifie que la méthode est bien un post
    $data = json_decode(file_get_contents("php://input"), true); // On récupère les inputs du front
    if (isset($data['action']) && $data['action'] === 'addNotes') { // On vérifie que l'action est bien d'ajouter une note
        $matiere = $data['matiere'];
        $stmt = $bdd->prepare("
            INSERT INTO notes (eleve_id, matiere, note, coefficient)
            VALUES (:eleve_id, :matiere, :note, :coefficient)
        "); // Préparation de la requête avec les placeholders

        // On récupère la note à insérer
        $n = null;
        if (isset($data['notes'][0]))
        {
            $n = $data['notes'][0];
        }

        if ($n) { // Si on a bien récup une note (pas null) on execute la requette
            $stmt->execute([
                'eleve_id'    => $n['studentId'],
                'matiere'     => $matiere,
                'note'        => $n['note'],
                'coefficient' => $n['coefficient']
            ]);
        }

        echo json_encode(['success' => true]);
        exit;
    }
}

// GET pour récup les notes de l'élèves
if (empty($_GET['id'])) {
    echo json_encode([]);
    exit;
}
$param = $_GET['id']; // On récupère la valeur du paramètre mis dans l'url
$stmt = $bdd->prepare(" 
    SELECT CONCAT(u.prenom,' ',u.nom) AS nom_eleve,
        n.matiere,
        n.note,
        n.coefficient
    FROM notes n
    JOIN utilisateurs u ON n.eleve_id = u.id
    WHERE u.id = :valeur
    "); // Requete préparée avec la contrainte where qui cible l'id de l'utilisateur
$stmt->execute(['valeur' => "$param%"]); // on exécute la requete préparée 

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); // On l'envoie au front
