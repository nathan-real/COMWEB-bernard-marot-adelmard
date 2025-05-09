-- Suppression si elles existent
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS utilisateurs;

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifiant  VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom          VARCHAR(100) NOT NULL,
    prenom       VARCHAR(100) NOT NULL,
    type         ENUM('eleve','prof') NOT NULL,
    matiere      VARCHAR(100) NULL    -- NULL pour les élèves, nom de la matière pour les profs
);

-- Création de la table notes (sans la colonne date)
CREATE TABLE notes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id    INT NOT NULL,
    matiere     VARCHAR(100) NOT NULL,
    note        FLOAT NOT NULL,
    coefficient FLOAT DEFAULT 1,
    FOREIGN KEY (eleve_id) REFERENCES utilisateurs(id)
);

-- Insertion d’exemples d’utilisateurs
INSERT INTO utilisateurs (identifiant, mot_de_passe, nom, prenom, type, matiere) VALUES
  ('durand',      'azerty',     'Durand',   'Paul',       'eleve', NULL),
  ('lemoine',     '1234',       'Lemoine',  'Julie',      'eleve', NULL),
  ('nadelmard',   'bonjour',    'Adelmard', 'Nathan',     'eleve', NULL),
  ('lejbernardo', '83tilsense', 'Bernard',  'Julien',     'eleve', NULL),
  ('bernardprof', 'profpass',   'Bernard',  'Jean',       'prof',  'Maths'),
  ('martinprof',  'profpass2',  'Martin',   'Alice',      'prof',  'Physique'),
  ('fplacin',     'comweb',     'Placin',   'Frédérique', 'prof',  'Communication-Web'
);

-- Insertion d’exemples de notes
INSERT INTO notes (eleve_id, matiere, note, coefficient) VALUES
  (1, 'Maths',            15.5, 2),
  (2, 'Maths',            17.0, 2),
  (3, 'Maths',            14.0, 1),
  (2, 'Physique',         12.0, 1),
  (3, 'Physique',         14.5, 1),
  (4, 'Physique',         13.0, 1),
  (1, 'Communication-Web',15.0, 1),
  (3, 'Communication-Web',14.5, 1),
  (4, 'Communication-Web',20.0, 1);
