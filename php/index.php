<?php
// ⚙️ Connexion à la base de données
$host = 'nadelmard.zzz.bordeaux-inp.fr';
$dbname = 'nadelmard';
$username = 'nadelmard';
$password = 'comweb';

try {
    $bdd = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // echo "Connexion réussie<br>";
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}

// 📤 Fonction pour envoyer un tableau en JSON
function envoiJSON($tab) {
    header('Content-Type: application/json');
    echo json_encode($tab, JSON_UNESCAPED_UNICODE);
}

// 📥 Fonction pour récupérer les données selon l'URL
function recupNotes($texte, $bdd) {
    // Exemple : si $texte = "Durand" => on cherche par nom d'élève
    // Si $texte est numérique => on cherche par ID
    if (is_numeric($texte)) {
        $requete = "SELECT * FROM notes WHERE eleve_id LIKE \"$texte%\"";
    } else {
        $requete = "SELECT * FROM notes WHERE nom_eleve LIKE \"$texte%\"";
    }

    $resultat = $bdd->query($requete);
    $tableau = $resultat->fetchAll(PDO::FETCH_ASSOC);
    return $tableau;
}

// 🧠 Logique principale
if (empty($_GET)) {
    header("Content-Type: text/html; charset=UTF-8");
    echo "<h1>Bienvenue sur l'API de gestion des notes</h1>";
    echo "<p>Utilisez l'URL avec ?url=nom_ou_id pour récupérer des données.</p>";
} else {
    $param = $_GET['url'];
    $donnees = recupNotes($param, $bdd);
    envoiJSON($donnees);
}
?>
