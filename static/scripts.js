// Charger les cycles existants
function loadCycles() {
    fetch('/get_cycles')
        .then(response => response.json())
        .then(data => {
            const cycleList = document.getElementById('cycleList');
            cycleList.innerHTML = '';
            data.cycles.forEach(cycle => {
                const cycleItem = document.createElement('div');
                cycleItem.textContent = cycle.name;
                cycleList.appendChild(cycleItem);
            });
        });
}

// Charger les filières existantes
function loadPrograms() {
    fetch('/get_programs')
        .then(response => response.json())
        .then(data => {
            const programList = document.getElementById('programList');
            programList.innerHTML = '';
            data.programs.forEach(program => {
                const programItem = document.createElement('div');
                programItem.textContent = `${program.name} (Cycle ID: ${program.cycle_id})`;
                programList.appendChild(programItem);
            });
        });
}

// Charger les étudiants existants
function loadStudents() {
    fetch('/get_students')
        .then(response => response.json())
        .then(data => {
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';
            data.students.forEach(student => {
                const studentItem = document.createElement('div');
                studentItem.textContent = `${student.full_name} (${student.login_id})`;
                studentList.appendChild(studentItem);
            });
        });
}

// Charger les professeurs existants
function loadProfessors() {
    fetch('/get_professors')
        .then(response => response.json())
        .then(data => {
            const professorList = document.getElementById('professorList');
            professorList.innerHTML = '';
            data.professors.forEach(professor => {
                const professorItem = document.createElement('div');
                professorItem.textContent = `${professor.full_name} (${professor.login_id}) - ${professor.subjects}`;
                professorList.appendChild(professorItem);
            });
        });
}

// Charger toutes les données au démarrage
window.addEventListener('load', () => {
    loadCycles();
    loadPrograms();
    loadStudents();
    loadProfessors();
});

// ==============================================
// Fonctions pour l'espace étudiant
// ==============================================

// Expliquer une absence
document.getElementById('explainAbsenceForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const absenceId = document.getElementById('absenceId').value;
    const explanation = document.getElementById('explanation').value;

    if (absenceId && explanation) {
        fetch('/explain_absence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ absenceId, explanation })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Absence expliquée avec succès !');
                location.reload();
            } else {
                alert('Erreur lors de l\'explication de l\'absence.');
            }
        });
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// ==============================================
// Fonctions pour l'espace professeur
// ==============================================

// Ajouter une absence
document.getElementById('addAbsenceForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentSelect').value;
    const date = document.getElementById('absenceDate').value;
    const subject = document.getElementById('absenceSubject').value;

    if (studentId && date && subject) {
        fetch('/add_absence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, date, subject })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Absence ajoutée avec succès !');
                location.reload();
            } else {
                alert('Erreur lors de l\'ajout de l\'absence.');
            }
        });
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// Ajouter une note
document.getElementById('addGradeForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentSelectGrade').value;
    const subject = document.getElementById('gradeSubject').value;
    const grade = document.getElementById('gradeValue').value;

    if (studentId && subject && grade) {
        fetch('/add_grade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, subject, grade })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Note ajoutée avec succès !');
                location.reload();
            } else {
                alert('Erreur lors de l\'ajout de la note.');
            }
        });
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// Ajouter un commentaire
document.getElementById('addCommentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = document.getElementById('studentSelectComment').value;
    const subject = document.getElementById('commentSubject').value;
    const comment = document.getElementById('commentText').value;

    if (studentId && subject && comment) {
        fetch('/add_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, subject, comment })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Commentaire ajouté avec succès !');
                location.reload();
            } else {
                alert('Erreur lors de l\'ajout du commentaire.');
            }
        });
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});

// ==============================================
// Fonctions utilitaires
// ==============================================

// Charger les étudiants pour les sélecteurs
function loadStudents() {
    fetch('/get_students')
        .then(response => response.json())
        .then(data => {
            const studentSelects = document.querySelectorAll('.studentSelect');
            studentSelects.forEach(select => {
                select.innerHTML = '<option value="">Choisir un étudiant</option>';
                data.students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.student_id;
                    option.textContent = student.full_name;
                    select.appendChild(option);
                });
            });
        });
}

// Charger les étudiants au chargement de la page
window.addEventListener('load', loadStudents);

// Charger les cycles et filières
function loadCyclesPrograms() {
    fetch('/get_cycles_programs')
        .then(response => response.json())
        .then(data => {
            // Remplir le sélecteur des cycles
            const cycleSelect = document.getElementById('programCycle');
            cycleSelect.innerHTML = '<option value="">Choisir un cycle</option>';
            data.cycles.forEach(cycle => {
                const option = document.createElement('option');
                option.value = cycle.cycle_id;
                option.textContent = cycle.name;
                cycleSelect.appendChild(option);
            });

            // Remplir le tableau des cycles et filières
            const tableBody = document.querySelector('#cycleProgramTable tbody');
            tableBody.innerHTML = '';
            data.programs.forEach(program => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${program.cycle_name}</td>
                    <td>${program.program_name}</td>
                    <td>
                        <button onclick="deleteProgram(${program.program_id})">Supprimer</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

// Ajouter un cycle
document.getElementById('addCycleForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const cycleName = document.getElementById('cycleName').value;

    if (cycleName) {
        fetch('/add_cycle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cycleName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cycle ajouté avec succès !');
                loadCyclesPrograms(); // Recharger les données
            } else {
                alert('Erreur lors de l\'ajout du cycle.');
            }
        });
    } else {
        alert('Veuillez entrer un nom de cycle.');
    }
});

// Ajouter une filière
document.getElementById('addProgramForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const cycleId = document.getElementById('programCycle').value;
    const programName = document.getElementById('programName').value;

    if (cycleId && programName) {
        fetch('/add_program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cycleId, programName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Filière ajoutée avec succès !');
                loadCyclesPrograms(); // Recharger les données
            } else {
                alert('Erreur lors de l\'ajout de la filière.');
            }
        });
    } else {
        alert('Veuillez remplir tous les champs.');
    }
});
// Modifier un cycle
function editCycle(cycleId, newName) {
    fetch('/edit_cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cycleId, newName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cycle modifié avec succès !');
            loadCycles(); // Recharger la liste des cycles
        } else {
            alert('Erreur lors de la modification du cycle.');
        }
    });
}

// Modifier une filière
function editProgram(programId, newName, newCycleId) {
    fetch('/edit_program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId, newName, newCycleId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Filière modifiée avec succès !');
            loadPrograms(); // Recharger la liste des filières
        } else {
            alert('Erreur lors de la modification de la filière.');
        }
    });
}

// Modifier un étudiant
function editStudent(studentId, newFullName, newLogin, newPassword, newProgramId) {
    fetch('/edit_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, newFullName, newLogin, newPassword, newProgramId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Étudiant modifié avec succès !');
            loadStudents(); // Recharger la liste des étudiants
        } else {
            alert('Erreur lors de la modification de l\'étudiant.');
        }
    });
}

// Modifier un professeur
function editProfessor(professorId, newFullName, newLogin, newPassword, newSubjects, newPrograms) {
    fetch('/edit_professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professorId, newFullName, newLogin, newPassword, newSubjects, newPrograms })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Professeur modifié avec succès !');
            loadProfessors(); // Recharger la liste des professeurs
        } else {
            alert('Erreur lors de la modification du professeur.');
        }
    });
}
// Charger les cycles et filières au démarrage
window.addEventListener('load', loadCyclesPrograms);