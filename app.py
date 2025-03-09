from flask import Flask, render_template, redirect, url_for, request, session, flash
import mysql.connector
from database import get_db_connection

app = Flask(__name__)
app.secret_key = 'votre_cle_secrete'

# Page d'accueil
@app.route('/')
def index():
    return render_template('index.html')

# Connexion
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        mot_de_passe = request.form['mot_de_passe']

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM utilisateurs WHERE email = %s AND mot_de_passe = %s', (email, mot_de_passe))
        utilisateur = cursor.fetchone()
        cursor.close()
        conn.close()

        if utilisateur:
            session['user_id'] = utilisateur['id']
            session['role'] = utilisateur['role']

            if utilisateur['role'] == 'admin':
                return redirect(url_for('admin'))
            elif utilisateur['role'] == 'professeur':
                return redirect(url_for('professeur'))
            elif utilisateur['role'] == 'eleve':
                return redirect(url_for('eleve'))
        else:
            flash('Email ou mot de passe incorrect.', 'error')

    return render_template('index.html')

# Interface administration
@app.route('/admin')
def admin():
    if 'user_id' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM utilisateurs')
    utilisateurs = cursor.fetchall()
    cursor.execute('SELECT * FROM classes')
    classes = cursor.fetchall()
    cursor.execute('SELECT * FROM matieres')
    matieres = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('admin.html', utilisateurs=utilisateurs, classes=classes, matieres=matieres)

# Interface professeur
@app.route('/professeur')
def professeur():
    if 'user_id' not in session or session['role'] != 'professeur':
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT classes.nom AS classe, matieres.nom AS matiere, emploi_du_temps.id AS emploi_id
        FROM emploi_du_temps
        JOIN classes ON emploi_du_temps.classe_id = classes.id
        JOIN matieres ON emploi_du_temps.matiere_id = matieres.id
        WHERE emploi_du_temps.professeur_id = %s
    ''', (session['user_id'],))
    cours = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('professeur.html', cours=cours)

# Interface élève
@app.route('/eleve')
def eleve():
    if 'user_id' not in session or session['role'] != 'eleve':
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT matieres.nom, notes.note, notes.commentaire
        FROM notes
        JOIN matieres ON notes.matiere_id = matieres.id
        WHERE notes.eleve_id = %s
    ''', (session['user_id'],))
    matieres = cursor.fetchall()
    cursor.execute('''
        SELECT absences.date, matieres.nom AS matiere
        FROM absences
        JOIN emploi_du_temps ON absences.emploi_du_temps_id = emploi_du_temps.id
        JOIN matieres ON emploi_du_temps.matiere_id = matieres.id
        WHERE absences.eleve_id = %s
    ''', (session['user_id'],))
    absences = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('eleve.html', matieres=matieres, absences=absences)

# Déconnexion
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)