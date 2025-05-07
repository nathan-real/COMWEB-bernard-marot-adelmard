<?php
// 1) Gérer la pré-flight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("HTTP/1.1 200 OK");
    exit(0);
}

// 2) Pour toutes les vraies requêtes POST suivantes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Connexion à la base
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

// Lecture du JSON du body
$donnees = json_decode(file_get_contents("php://input"), true);

// Sécurité : éviter les “undefined index”
if (isset($donnees['identifiant'])) {
    $identifiant = $donnees['identifiant'];
} else {
    $identifiant = '';
}
if (isset($donnees['mot_de_passe'])) {
    $mot_de_passe = $donnees['mot_de_passe'];
} else {
    $mot_de_passe = '';
}

// Recherche de l'utilisateur
$stmt = $bdd->prepare("SELECT id, nom, prenom, type, mot_de_passe 
                       FROM utilisateurs 
                       WHERE identifiant = :identifiant");
$stmt->execute(['identifiant' => $identifiant]);
$utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérification du mot de passe (en clair pour l'instant)
if ($utilisateur && $mot_de_passe === $utilisateur['mot_de_passe']) {
    unset($utilisateur['mot_de_passe']); // On ne renvoie pas le mot de passe
    echo json_encode($utilisateur);
} else {
    http_response_code(401);
    echo json_encode(['erreur' => 'Identifiant ou mot de passe incorrect']);
}
