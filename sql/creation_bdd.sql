CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    type ENUM('eleve', 'prof') NOT NULL
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    note FLOAT NOT NULL,
    coefficient FLOAT DEFAULT 1,
    date DATE,
    FOREIGN KEY (eleve_id) REFERENCES utilisateurs(id)
);



INSERT INTO notes (eleve_id, nom_eleve, matiere, note, coefficient, date) VALUES
(101, 'Durand', 'Maths', 15.5, 2, '2025-03-10'),
(101, 'Durand', 'Physique', 12.0, 1, '2025-03-15'),
(101, 'Durand', 'Français', 13.5, 1.5, '2025-04-02');

INSERT INTO utilisateurs (identifiant, mot_de_passe, nom, prenom, type) VALUES
('durand', 'azerty', 'Durand', 'Paul', 'eleve'),
('lemoine', '1234', 'Lemoine', 'Julie', 'eleve'),
('bernardprof', 'profpass', 'Bernard', 'Jean', 'prof');

