import mysql.connector

def get_db_connection():
    """
    Établit une connexion à la base de données MySQL.
    """
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="gestion_absences"
    )
    return conn

def init_db():
    """
    Initialise la base de données en créant les tables si elles n'existent pas.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Table des utilisateurs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS utilisateurs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                mot_de_passe VARCHAR(255) NOT NULL,
                role ENUM('eleve', 'professeur', 'admin') NOT NULL
            )
        ''')

        # Table des classes
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS classes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL UNIQUE
            )
        ''')

        # Table des matières
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS matieres (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL UNIQUE
            )
        ''')

        # Table des emplois du temps
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emploi_du_temps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                matiere_id INT NOT NULL,
                professeur_id INT NOT NULL,
                classe_id INT NOT NULL,
                jour VARCHAR(50) NOT NULL,
                heure_debut TIME NOT NULL,
                heure_fin TIME NOT NULL,
                FOREIGN KEY (matiere_id) REFERENCES matieres (id),
                FOREIGN KEY (professeur_id) REFERENCES utilisateurs (id),
                FOREIGN KEY (classe_id) REFERENCES classes (id)
            )
        ''')

        # Table des absences
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS absences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                eleve_id INT NOT NULL,
                emploi_du_temps_id INT NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (eleve_id) REFERENCES utilisateurs (id),
                FOREIGN KEY (emploi_du_temps_id) REFERENCES emploi_du_temps (id)
            )
        ''')

        # Table des notes et commentaires
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                eleve_id INT NOT NULL,
                matiere_id INT NOT NULL,
                note FLOAT NOT NULL,
                commentaire TEXT,
                FOREIGN KEY (eleve_id) REFERENCES utilisateurs (id),
                FOREIGN KEY (matiere_id) REFERENCES matieres (id)
            )
        ''')

        # Table des explications des étudiants
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS explications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                eleve_id INT NOT NULL,
                absence_id INT NOT NULL,
                message TEXT NOT NULL,
                FOREIGN KEY (eleve_id) REFERENCES utilisateurs (id),
                FOREIGN KEY (absence_id) REFERENCES absences (id)
            )
        ''')

        print("Les tables ont été créées avec succès.")
    except mysql.connector.Error as err:
        print(f"Erreur lors de la création des tables : {err}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    init_db()