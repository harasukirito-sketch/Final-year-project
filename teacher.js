/* =============================================
   EDUQUEST - Teacher Dashboard & Tools
   ============================================= */

function renderTeacherDashboard() {
    const students = DB.getStudents();
    const totalLessonsCount = Object.values(DB.lessons).reduce((s, l) => s + l.length, 0);
    const totalQuizzes = Object.values(DB.quizzes).reduce((s, q) => s + q.length, 0);
    const allScores = [];
    students.forEach(s => {
        const p = DB.getProgress(s.id);
        Object.values(p.quizScores).forEach(sc => allScores.push(sc));
    });
    const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
    const area = document.getElementById('content-area');

    area.innerHTML = `
    <div class="welcome-banner" style="background:linear-gradient(135deg,#00cec9,#0984e3)">
      <div class="welcome-text"><h1>Welcome, ${currentUser.name.split(' ')[0]}! 📚</h1><p>Manage your classes and monitor student progress.</p></div>
      <div class="welcome-icon"><i class="fas fa-chalkboard-teacher"></i></div>
    </div>
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-card-icon purple"><i class="fas fa-users"></i></div>
        <div class="stat-card-info"><h4>Students</h4><div class="stat-value">${students.length}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon teal"><i class="fas fa-book-open"></i></div>
        <div class="stat-card-info"><h4>Total Lessons</h4><div class="stat-value">${totalLessonsCount}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green"><i class="fas fa-question-circle"></i></div>
        <div class="stat-card-info"><h4>Total Quizzes</h4><div class="stat-value">${totalQuizzes}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange"><i class="fas fa-chart-line"></i></div>
        <div class="stat-card-info"><h4>Avg Score</h4><div class="stat-value">${avgScore}%</div></div>
      </div>
    </div>
    <div class="dashboard-grid">
      <div>
        <div class="chart-container mb-3">
          <h3>Student Performance Overview</h3>
          <div class="bar-chart" id="teacher-bar-chart"></div>
        </div>
        <div class="card">
          <h3 style="margin-bottom:1rem">Student Leaderboard</h3>
          <div class="table-container">
            <table class="data-table">
              <thead><tr><th>Student</th><th>Level</th><th>XP</th><th>Lessons</th><th>Avg Score</th></tr></thead>
              <tbody>
                ${students.sort((a, b) => (b.xp || 0) - (a.xp || 0)).map(s => {
        const p = DB.getProgress(s.id);
        const scores = Object.values(p.quizScores);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return `<tr>
                    <td><div class="student-row"><div class="student-avatar">${s.name.charAt(0)}</div><span class="student-name">${s.name}</span></div></td>
                    <td>${s.level || 1}</td><td>${s.xp || 0}</td><td>${p.completedLessons.length}</td>
                    <td><span class="${avg >= 80 ? 'score-high' : avg >= 50 ? 'score-mid' : 'score-low'}">${avg}%</span></td>
                  </tr>`;
    }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <div class="card mb-3">
          <h3 style="margin-bottom:1rem">Quick Tools</h3>
          <button class="btn btn-primary btn-block mb-2" onclick="navigateTo('manage-lessons')"><i class="fas fa-chalkboard"></i> Manage Lessons</button>
          <button class="btn btn-accent btn-block mb-2" onclick="navigateTo('manage-quizzes')"><i class="fas fa-question-circle"></i> Manage Quizzes</button>
          <button class="btn btn-secondary btn-block mb-2" onclick="navigateTo('upload-materials')"><i class="fas fa-cloud-upload-alt"></i> Upload Materials</button>
          <button class="btn btn-secondary btn-block" onclick="navigateTo('student-progress')"><i class="fas fa-chart-bar"></i> View Progress</button>
        </div>
        <div class="card mb-3">
          <h3 style="margin-bottom:1rem">Class Distribution</h3>
          <div id="teacher-donut-chart"></div>
        </div>
        <div class="card">
          <h3 style="margin-bottom:1rem">Recent Quiz Submissions</h3>
          <div class="activity-feed">
            ${generateTeacherActivity(students)}
          </div>
        </div>
      </div>
    </div>`;
    setTimeout(() => {
        renderTeacherBarChart(students);
        renderTeacherDonutChart(students);
    }, 100);
}

function generateTeacherActivity(students) {
    const items = [];
    students.forEach(s => {
        const p = DB.getProgress(s.id);
        Object.entries(p.quizScores).forEach(([key, score]) => {
            const [sid] = key.split('-');
            const subj = DB.getSubject(sid);
            if (subj) items.push({ name: s.name, subj: subj.name, score, icon: score >= 80 ? 'achievement' : 'quiz' });
        });
    });
    return items.slice(-5).reverse().map(i => `
    <div class="activity-item">
      <div class="activity-icon ${i.icon}"><i class="fas fa-${i.icon === 'achievement' ? 'star' : 'pencil-alt'}"></i></div>
      <div class="activity-content"><p><strong>${i.name}</strong> scored ${i.score}% in ${i.subj}</p><div class="activity-time">Recently</div></div>
    </div>`).join('') || '<p style="color:var(--text-muted);font-size:0.9rem">No submissions yet</p>';
}

// ---- Manage Lessons ----
function renderManageLessons() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header flex-between">
      <div><h1>Manage Lessons</h1><p>Create and organize lesson content for your subjects</p></div>
      <button class="btn btn-primary" onclick="openAddLessonModal()"><i class="fas fa-plus"></i> Add Lesson</button>
    </div>
    <div class="tabs mb-3">
      ${DB.subjects.map((s, i) => `<button class="tab ${i === 0 ? 'active' : ''}" onclick="filterTeacherLessons('${s.id}', this)">${s.name}</button>`).join('')}
    </div>
    <div id="teacher-lessons-list">${renderTeacherLessonList(DB.subjects[0].id)}</div>`;
}

function filterTeacherLessons(subjectId, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('teacher-lessons-list').innerHTML = renderTeacherLessonList(subjectId);
}

function renderTeacherLessonList(subjectId) {
    const lessons = DB.getLessons(subjectId);
    if (!lessons.length) return '<div class="empty-state"><i class="fas fa-book-open"></i><h3>No lessons yet</h3><p>Add your first lesson for this subject</p></div>';
    return lessons.map((l, i) => `
    <div class="lesson-card">
      <div class="lesson-card-number">${i + 1}</div>
      <div class="lesson-card-content"><h4>${l.title}</h4><p>${l.duration} • ${l.type}</p></div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-sm btn-secondary" onclick="openEditLessonModal('${subjectId}','${l.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteLesson('${subjectId}','${l.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function openAddLessonModal() {
    openModal('Add New Lesson', `
    <form onsubmit="addLesson(event)">
      <div class="form-group"><label>Subject</label>
        <select id="new-lesson-subject">${DB.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>Lesson Title</label><input type="text" id="new-lesson-title" required placeholder="Enter lesson title"></div>
      <div class="form-group"><label>Duration</label><input type="text" id="new-lesson-duration" required placeholder="e.g. 25 min"></div>
      <div class="form-group"><label>Content (HTML)</label><textarea id="new-lesson-content" rows="6" placeholder="Enter lesson content in HTML format..."></textarea></div>
      <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-plus"></i> Add Lesson</button>
    </form>`);
}

function addLesson(e) {
    e.preventDefault();
    const subjectId = document.getElementById('new-lesson-subject').value;
    const title = document.getElementById('new-lesson-title').value;
    const duration = document.getElementById('new-lesson-duration').value;
    const content = document.getElementById('new-lesson-content').value || '<h2>' + title + '</h2><p>Lesson content here.</p>';
    const lessons = DB.lessons[subjectId] || [];
    lessons.push({ id: 'l' + (lessons.length + 1), title, order: lessons.length + 1, duration, type: 'lesson', content });
    DB.lessons[subjectId] = lessons;
    closeModal();
    showToast('Lesson added successfully!', 'success');
    renderManageLessons();
}

function openEditLessonModal(subjectId, lessonId) {
    const lesson = DB.getLessons(subjectId).find(l => l.id === lessonId);
    if (!lesson) return;
    openModal('Edit Lesson', `
    <form onsubmit="editLesson(event, '${subjectId}', '${lessonId}')">
      <div class="form-group"><label>Title</label><input type="text" id="edit-lesson-title" value="${lesson.title}" required></div>
      <div class="form-group"><label>Duration</label><input type="text" id="edit-lesson-duration" value="${lesson.duration}" required></div>
      <div class="form-group"><label>Content (HTML)</label><textarea id="edit-lesson-content" rows="6">${lesson.content}</textarea></div>
      <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-save"></i> Save Changes</button>
    </form>`);
}

function editLesson(e, subjectId, lessonId) {
    e.preventDefault();
    const lesson = DB.getLessons(subjectId).find(l => l.id === lessonId);
    if (!lesson) return;
    lesson.title = document.getElementById('edit-lesson-title').value;
    lesson.duration = document.getElementById('edit-lesson-duration').value;
    lesson.content = document.getElementById('edit-lesson-content').value;
    closeModal();
    showToast('Lesson updated!', 'success');
    renderManageLessons();
}

function deleteLesson(subjectId, lessonId) {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    DB.lessons[subjectId] = DB.lessons[subjectId].filter(l => l.id !== lessonId);
    showToast('Lesson deleted.', 'warning');
    renderManageLessons();
}

// ---- Manage Quizzes ----
function renderManageQuizzes() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header flex-between">
      <div><h1>Manage Quizzes</h1><p>Create quiz questions for each subject</p></div>
      <button class="btn btn-primary" onclick="openAddQuizModal()"><i class="fas fa-plus"></i> Add Quiz</button>
    </div>
    <div class="tabs mb-3">
      ${DB.subjects.map((s, i) => `<button class="tab ${i === 0 ? 'active' : ''}" onclick="filterTeacherQuizzes('${s.id}', this)">${s.name}</button>`).join('')}
    </div>
    <div id="teacher-quizzes-list">${renderTeacherQuizList(DB.subjects[0].id)}</div>`;
}

function filterTeacherQuizzes(subjectId, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('teacher-quizzes-list').innerHTML = renderTeacherQuizList(subjectId);
}

function renderTeacherQuizList(subjectId) {
    const quizzes = DB.getQuizzes(subjectId);
    if (!quizzes.length) return '<div class="empty-state"><i class="fas fa-question-circle"></i><h3>No quizzes yet</h3><p>Create your first quiz</p></div>';
    return quizzes.map(q => `
    <div class="lesson-card">
      <div class="lesson-card-number" style="background:var(--gradient-accent)"><i class="fas fa-question" style="font-size:0.9rem"></i></div>
      <div class="lesson-card-content"><h4>${q.title}</h4><p>${q.questions.length} questions</p></div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-sm btn-secondary" onclick="viewQuizQuestions('${subjectId}','${q.id}')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${subjectId}','${q.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function openAddQuizModal() {
    openModal('Add New Quiz', `
    <form onsubmit="addQuiz(event)">
      <div class="form-group"><label>Subject</label>
        <select id="new-quiz-subject">${DB.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>Quiz Title</label><input type="text" id="new-quiz-title" required placeholder="e.g. Chapter 1 Quiz"></div>
      <div id="quiz-questions-builder">
        <h4 style="margin:1rem 0 0.5rem">Questions</h4>
        <div id="questions-list"></div>
        <button type="button" class="btn btn-sm btn-secondary mt-2" onclick="addQuestionField()"><i class="fas fa-plus"></i> Add Question</button>
      </div>
      <button type="submit" class="btn btn-primary btn-block mt-3"><i class="fas fa-save"></i> Create Quiz</button>
    </form>`);
    addQuestionField();
}

let questionCount = 0;
function addQuestionField() {
    questionCount++;
    const n = questionCount;
    const div = document.createElement('div');
    div.className = 'card mb-2';
    div.style.padding = '1rem';
    div.innerHTML = `
    <div class="form-group"><label>Q${n}: Question</label><input type="text" class="q-text" required placeholder="Enter question"></div>
    <div class="form-group"><label>Option A</label><input type="text" class="q-opt-a" required placeholder="Option A"></div>
    <div class="form-group"><label>Option B</label><input type="text" class="q-opt-b" required placeholder="Option B"></div>
    <div class="form-group"><label>Option C</label><input type="text" class="q-opt-c" placeholder="Option C (optional)"></div>
    <div class="form-group"><label>Option D</label><input type="text" class="q-opt-d" placeholder="Option D (optional)"></div>
    <div class="form-group"><label>Correct Answer</label>
      <select class="q-answer"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div>`;
    document.getElementById('questions-list').appendChild(div);
}

function addQuiz(e) {
    e.preventDefault();
    const subjectId = document.getElementById('new-quiz-subject').value;
    const title = document.getElementById('new-quiz-title').value;
    const cards = document.querySelectorAll('#questions-list .card');
    const questions = [];
    cards.forEach(card => {
        const q = card.querySelector('.q-text').value;
        const opts = [card.querySelector('.q-opt-a').value, card.querySelector('.q-opt-b').value, card.querySelector('.q-opt-c')?.value, card.querySelector('.q-opt-d')?.value].filter(Boolean);
        const answer = parseInt(card.querySelector('.q-answer').value);
        if (q && opts.length >= 2) questions.push({ q, options: opts, answer });
    });
    if (!questions.length) { showToast('Add at least one question.', 'error'); return; }
    const quizzes = DB.quizzes[subjectId] || [];
    quizzes.push({ id: 'q' + (quizzes.length + 1), lessonId: 'l1', title, questions });
    DB.quizzes[subjectId] = quizzes;
    questionCount = 0;
    closeModal();
    showToast('Quiz created!', 'success');
    renderManageQuizzes();
}

function viewQuizQuestions(subjectId, quizId) {
    const quiz = DB.getQuizzes(subjectId).find(q => q.id === quizId);
    if (!quiz) return;
    openModal(quiz.title, quiz.questions.map((q, i) => `
    <div class="card mb-2" style="padding:1rem">
      <p style="font-weight:600;margin-bottom:0.5rem">Q${i + 1}: ${q.q}</p>
      ${q.options.map((o, j) => `<p style="color:${j === q.answer ? 'var(--success)' : 'var(--text-muted)'};font-size:0.9rem">${String.fromCharCode(65 + j)}. ${o} ${j === q.answer ? '✓' : ''}</p>`).join('')}
    </div>`).join(''));
}

function deleteQuiz(subjectId, quizId) {
    if (!confirm('Delete this quiz?')) return;
    DB.quizzes[subjectId] = DB.quizzes[subjectId].filter(q => q.id !== quizId);
    showToast('Quiz deleted.', 'warning');
    renderManageQuizzes();
}

// ---- Upload Materials ----
function renderUploadMaterials() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header"><h1>Upload Materials</h1><p>Upload learning resources for your students</p></div>
    <div class="card" style="max-width:600px">
      <div class="form-group"><label>Subject</label>
        <select id="upload-subject">${DB.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
      <div class="form-group"><label>Material Title</label><input type="text" id="upload-title" placeholder="e.g. Chapter 1 Notes"></div>
      <div class="form-group"><label>Description</label><textarea id="upload-desc" rows="3" placeholder="Brief description of the material"></textarea></div>
      <div class="upload-area" onclick="document.getElementById('file-input').click()">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload or drag and drop</p>
        <p class="upload-hint">PDF, DOCX, PPT, Images, Videos (Max 50MB)</p>
        <input type="file" id="file-input" style="display:none" onchange="handleFileSelect(this)">
      </div>
      <div id="upload-preview" class="mt-2"></div>
      <button class="btn btn-primary btn-block mt-3" onclick="submitUpload()"><i class="fas fa-upload"></i> Upload Material</button>
    </div>`;
}

function handleFileSelect(input) {
    if (input.files.length) {
        document.getElementById('upload-preview').innerHTML = `
      <div class="card" style="padding:0.75rem;display:flex;align-items:center;gap:0.75rem">
        <i class="fas fa-file" style="color:var(--primary-light);font-size:1.5rem"></i>
        <div><p style="font-weight:500">${input.files[0].name}</p><p style="font-size:0.8rem;color:var(--text-muted)">${(input.files[0].size / 1024).toFixed(1)} KB</p></div>
      </div>`;
    }
}

function submitUpload() {
    const title = document.getElementById('upload-title').value;
    if (!title) { showToast('Please enter a title.', 'error'); return; }
    showToast('Material uploaded successfully!', 'success');
    renderUploadMaterials();
}

// ---- Student Progress Page (Teacher) ----
function renderStudentProgressPage() {
    const students = DB.getStudents();
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header"><h1>Student Progress</h1><p>Monitor individual student performance and activity</p></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Student</th><th>Level</th><th>XP</th><th>Lessons</th><th>Quizzes</th><th>Avg Score</th><th>Actions</th></tr></thead>
        <tbody>
          ${students.map(s => {
        const p = DB.getProgress(s.id);
        const scores = Object.values(p.quizScores);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return `<tr>
              <td><div class="student-row"><div class="student-avatar">${s.name.charAt(0)}</div><span class="student-name">${s.name}</span></div></td>
              <td>${s.level || 1}</td><td>${s.xp || 0}</td><td>${p.completedLessons.length}</td><td>${scores.length}</td>
              <td><span class="${avg >= 80 ? 'score-high' : avg >= 50 ? 'score-mid' : 'score-low'}">${avg}%</span></td>
              <td><button class="btn btn-sm btn-secondary" onclick="viewStudentDetail(${s.id})"><i class="fas fa-eye"></i> View</button></td>
            </tr>`;
    }).join('')}
        </tbody>
      </table>
    </div>`;
}

function viewStudentDetail(studentId) {
    const student = DB.users.find(u => u.id === studentId);
    const prog = DB.getProgress(studentId);
    if (!student) return;
    const scores = Object.values(prog.quizScores);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    openModal(student.name + ' - Progress', `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
      <div class="profile-avatar-large" style="width:56px;height:56px;font-size:1.5rem">${student.name.charAt(0)}</div>
      <div><h3>${student.name}</h3><p style="color:var(--text-muted)">Level ${student.level || 1} • ${student.xp || 0} XP</p></div>
    </div>
    <h4 style="margin-bottom:0.75rem">Completed Lessons (${prog.completedLessons.length})</h4>
    ${prog.completedLessons.map(key => {
        const [sid, lid] = key.split('-');
        const subj = DB.getSubject(sid);
        const lesson = (DB.getLessons(sid) || []).find(l => l.id === lid);
        return `<p style="font-size:0.9rem;color:var(--text-secondary);padding:0.25rem 0"><i class="fas fa-check-circle" style="color:var(--success);margin-right:0.5rem"></i>${subj?.name} - ${lesson?.title || lid}</p>`;
    }).join('')}
    <h4 style="margin:1rem 0 0.75rem">Quiz Scores (Avg: ${avg}%)</h4>
    ${Object.entries(prog.quizScores).map(([key, score]) => {
        const [sid] = key.split('-');
        const subj = DB.getSubject(sid);
        return `<p style="font-size:0.9rem;padding:0.25rem 0"><span style="color:var(--text-secondary)">${subj?.name}:</span> <strong class="${score >= 80 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low'}">${score}%</strong></p>`;
    }).join('')}`);
}

// ---- Quiz Results Page (Teacher) ----
function renderQuizResultsPage() {
    const students = DB.getStudents();
    const area = document.getElementById('content-area');
    let rows = '';
    students.forEach(s => {
        const p = DB.getProgress(s.id);
        Object.entries(p.quizScores).forEach(([key, score]) => {
            const [sid, qid] = key.split('-');
            const subj = DB.getSubject(sid);
            const quiz = (DB.getQuizzes(sid) || []).find(q => q.id === qid);
            rows += `<tr>
        <td><div class="student-row"><div class="student-avatar">${s.name.charAt(0)}</div><span class="student-name">${s.name}</span></div></td>
        <td>${subj?.name || sid}</td><td>${quiz?.title || qid}</td>
        <td><span class="${score >= 80 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low'}">${score}%</span></td>
      </tr>`;
        });
    });
    area.innerHTML = `
    <div class="content-header"><h1>Quiz Results</h1><p>View all quiz submissions and scores</p></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Student</th><th>Subject</th><th>Quiz</th><th>Score</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No quiz results yet</td></tr>'}</tbody>
      </table>
    </div>`;
}
