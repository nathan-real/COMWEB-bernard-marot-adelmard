<?php
// Réponse au pré-flight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

// Headers pour la vraie requête
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

// Lecture du JSON envoyé par React
$donnees = json_decode(file_get_contents("php://input"), true);
$identifiant = isset($donnees['identifiant']) ? $donnees['identifiant'] : '';
$mot_de_passe = isset($donnees['mot_de_passe']) ? $donnees['mot_de_passe'] : '';

// Recherche
$stmt = $bdd->prepare("
    SELECT id, nom, prenom, type, matiere, mot_de_passe
    FROM utilisateurs
    WHERE identifiant = :identifiant
");
$stmt->execute(['identifiant' => $identifiant]);
$utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérification
if ($utilisateur && $mot_de_passe === $utilisateur['mot_de_passe']) {
    unset($utilisateur['mot_de_passe']);
    echo json_encode($utilisateur);
} else {
    echo json_encode(['erreur' => 'Identifiant ou mot de passe incorrect']);
}
