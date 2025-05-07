<?php

// 🔓 Autoriser les requêtes venant d'autres origines (React tourne sur localhost:5173 ou 3000)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

// ⚙️ Connexion à la base de données

$host = '127.0.0.1';
$dbname = 'projetnote';
$username = 'root';
$password = '';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

// 📤 Fonction pour envoyer un tableau en JSON
function envoiJSON($tab) {
    header('Content-Type: application/json');
    echo json_encode($tab, JSON_UNESCAPED_UNICODE);
}

// 📥 Fonction pour récupérer les notes par identifiant ou nom d'utilisateur
function recupNotes($texte, $bdd) {
   if (is_numeric($texte)) {
    $requete = "
        SELECT CONCAT(u.prenom, ' ', u.nom) AS nom_eleve, n.matiere, n.note, n.coefficient, n.date
        FROM notes n
        JOIN utilisateurs u ON n.eleve_id = u.id
        WHERE u.id = :valeur
    ";
} else {
    $requete = "
        SELECT CONCAT(u.prenom, ' ', u.nom) AS nom_eleve, n.matiere, n.note, n.coefficient, n.date
        FROM notes n
        JOIN utilisateurs u ON n.eleve_id = u.id
        WHERE u.identifiant LIKE :valeur
    ";
}


    $stmt = $bdd->prepare($requete);
    $stmt->execute(['valeur' => "$texte%"]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// 🧠 Logique principale
if (empty($_GET)) {
    header("Content-Type: text/html; charset=UTF-8");
    echo "<h1>Bienvenue sur l'API de gestion des notes</h1>";
    echo "<p>Ajoutez ?url=identifiant_ou_id pour interroger un élève.</p>";
} else {
    $param = $_GET['url'];
    $donnees = recupNotes($param, $bdd);
    envoiJSON($donnees);
}
?>
