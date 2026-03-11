/* =============================================
   EDUQUEST - Main App Controller
   ============================================= */

let currentView = 'dashboard';

// ---- Page Navigation ----
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
}

// ---- Init App ----
function initApp() {
    if (!currentUser) return;
    const avatar = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('sidebar-avatar').textContent = avatar;
    document.getElementById('sidebar-user-name').textContent = currentUser.name;
    document.getElementById('sidebar-user-role').textContent = currentUser.role;
    document.getElementById('topbar-avatar').textContent = avatar;
    buildSidebarNav();
    navigateTo('dashboard');
    renderNotifications();
}

// ---- Sidebar ----
function buildSidebarNav() {
    const nav = document.getElementById('sidebar-nav');
    const isTeacher = currentUser.role === 'teacher';
    let html = '<div class="nav-section-title">Main</div>';
    html += navItem('dashboard', 'fas fa-home', 'Dashboard');
    html += navItem('subjects', 'fas fa-book-open', 'Subjects');
    if (isTeacher) {
        html += '<div class="nav-section-title">Teacher Tools</div>';
        html += navItem('manage-lessons', 'fas fa-chalkboard', 'Manage Lessons');
        html += navItem('manage-quizzes', 'fas fa-question-circle', 'Manage Quizzes');
        html += navItem('upload-materials', 'fas fa-cloud-upload-alt', 'Upload Materials');
        html += '<div class="nav-section-title">Analytics</div>';
        html += navItem('student-progress', 'fas fa-chart-bar', 'Student Progress');
        html += navItem('quiz-results', 'fas fa-poll', 'Quiz Results');
    } else {
        html += '<div class="nav-section-title">Learning</div>';
        html += navItem('my-progress', 'fas fa-chart-line', 'My Progress');
        html += navItem('leaderboard', 'fas fa-trophy', 'Leaderboard');
    }
    html += '<div class="nav-section-title">Account</div>';
    html += navItem('profile', 'fas fa-user', 'Profile');
    nav.innerHTML = html;
}

function navItem(view, icon, label) {
    return `<button class="nav-item ${currentView === view ? 'active' : ''}" onclick="navigateTo('${view}')">
    <i class="${icon}"></i> ${label}
  </button>`;
}

function navigateTo(view) {
    currentView = view;
    buildSidebarNav();
    closeSidebar();
    const area = document.getElementById('content-area');
    switch (view) {
        case 'dashboard': currentUser.role === 'teacher' ? renderTeacherDashboard() : renderStudentDashboard(); break;
        case 'subjects': renderSubjects(); break;
        case 'my-progress': renderMyProgress(); break;
        case 'leaderboard': renderLeaderboard(); break;
        case 'manage-lessons': renderManageLessons(); break;
        case 'manage-quizzes': renderManageQuizzes(); break;
        case 'upload-materials': renderUploadMaterials(); break;
        case 'student-progress': renderStudentProgressPage(); break;
        case 'quiz-results': renderQuizResultsPage(); break;
        case 'profile': renderProfile(); break;
        default: area.innerHTML = '<div class="empty-state"><i class="fas fa-compass"></i><h3>Page not found</h3></div>';
    }
}

// ---- Sidebar Toggle ----
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = closeSidebar;
        document.getElementById('page-app').appendChild(overlay);
    }
    overlay.classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ---- Notifications ----
function renderNotifications() {
    const list = document.getElementById('notif-list');
    if (!DB.notifications.length) {
        list.innerHTML = '<div class="empty-state" style="padding:2rem"><p>No notifications</p></div>';
        return;
    }
    list.innerHTML = DB.notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon ${n.icon}"><i class="${n.iconClass}"></i></div>
      <div class="notif-content"><p>${n.text}</p><div class="notif-time">${n.time}</div></div>
    </div>`).join('');
}

function toggleNotifications() {
    document.getElementById('notifications-dropdown').classList.toggle('active');
}

function clearNotifications() {
    DB.notifications = [];
    document.getElementById('notif-badge').style.display = 'none';
    renderNotifications();
}

// ---- Toast ----
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="toast-icon fas ${icons[type]}"></i><span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
}

// ---- Modal ----
function openModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// ---- Search ----
function handleSearch(query) {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const results = DB.subjects.filter(s => s.name.toLowerCase().includes(q));
    if (results.length > 0) {
        renderSubjects(q);
    }
}

// ---- Render Subjects ----
function renderSubjects(filter = '') {
    const area = document.getElementById('content-area');
    let subjects = DB.subjects;
    if (filter) subjects = subjects.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
    area.innerHTML = `
    <div class="content-header"><h1>Subjects</h1><p>Explore Form 4 subjects and start learning</p></div>
    <div class="grid-auto">
      ${subjects.map(s => `
        <div class="subject-card" onclick="openSubject('${s.id}')">
          <div class="subject-card-header" style="background:linear-gradient(135deg, ${s.color}22, ${s.color}08)">
            <i class="${s.icon}" style="color:${s.color}"></i>
          </div>
          <div class="subject-card-body">
            <h3>${s.name}</h3>
            <p>${s.desc}</p>
            <div class="subject-card-meta">
              <span><i class="fas fa-book"></i> ${s.lessons} lessons</span>
              <span><i class="fas fa-question-circle"></i> ${(DB.getQuizzes(s.id) || []).length} quizzes</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

// ---- Open Subject ----
function openSubject(subjectId) {
    const subject = DB.getSubject(subjectId);
    const lessons = DB.getLessons(subjectId);
    const quizzes = DB.getQuizzes(subjectId);
    const prog = currentUser ? DB.getProgress(currentUser.id) : { completedLessons: [], quizScores: {} };
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header">
      <div class="breadcrumb"><a href="#" onclick="navigateTo('subjects')">Subjects</a> <i class="fas fa-chevron-right"></i> ${subject.name}</div>
      <h1>${subject.name}</h1><p>${subject.desc}</p>
    </div>
    <div class="tabs mb-3">
      <button class="tab active" onclick="showSubjectTab('lessons-tab', this)">Lessons</button>
      <button class="tab" onclick="showSubjectTab('quizzes-tab', this)">Quizzes</button>
    </div>
    <div id="lessons-tab">
      ${lessons.length ? lessons.map((l, i) => {
        const done = prog.completedLessons.includes(subjectId + '-' + l.id);
        return `<div class="lesson-card" onclick="openLesson('${subjectId}', '${l.id}')">
          <div class="lesson-card-number ${done ? 'completed' : ''}">${i + 1}</div>
          <div class="lesson-card-content"><h4>${l.title}</h4><p>${l.duration} • ${l.type}</p></div>
          <div class="lesson-card-status"><i class="fas ${done ? 'fa-check-circle' : 'fa-play-circle'}"></i></div>
        </div>`;
    }).join('') : '<div class="empty-state"><i class="fas fa-book-open"></i><h3>No lessons yet</h3></div>'}
    </div>
    <div id="quizzes-tab" style="display:none">
      ${quizzes.length ? quizzes.map(q => {
        const score = prog.quizScores[subjectId + '-' + q.id];
        return `<div class="lesson-card" onclick="startQuiz('${subjectId}', '${q.id}')">
          <div class="lesson-card-number" style="background:var(--gradient-accent)"><i class="fas fa-question" style="font-size:0.9rem"></i></div>
          <div class="lesson-card-content"><h4>${q.title}</h4><p>${q.questions.length} questions</p></div>
          <div class="lesson-card-status">${score !== undefined ? `<span class="badge-lg badge-success">${score}%</span>` : '<i class="fas fa-play-circle"></i>'}</div>
        </div>`;
    }).join('') : '<div class="empty-state"><i class="fas fa-question-circle"></i><h3>No quizzes yet</h3></div>'}
    </div>`;
}

function showSubjectTab(tabId, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('lessons-tab').style.display = tabId === 'lessons-tab' ? 'block' : 'none';
    document.getElementById('quizzes-tab').style.display = tabId === 'quizzes-tab' ? 'block' : 'none';
}

// ---- Open Lesson ----
function openLesson(subjectId, lessonId) {
    const subject = DB.getSubject(subjectId);
    const lessons = DB.getLessons(subjectId);
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    const idx = lessons.indexOf(lesson);
    const prev = idx > 0 ? lessons[idx - 1] : null;
    const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('subjects')">Subjects</a> <i class="fas fa-chevron-right"></i>
        <a href="#" onclick="openSubject('${subjectId}')">${subject.name}</a> <i class="fas fa-chevron-right"></i> ${lesson.title}
      </div>
      <h1>${lesson.title}</h1><p>${lesson.duration} • Lesson ${lesson.order}</p>
    </div>
    <div class="lesson-viewer">
      <div class="lesson-viewer-content">${lesson.content}</div>
      <div style="display:flex;gap:1rem;margin-bottom:1rem">
        <button class="btn btn-success btn-block" onclick="completeLesson('${subjectId}','${lessonId}')">
          <i class="fas fa-check"></i> Mark as Complete
        </button>
      </div>
      <div class="lesson-viewer-nav">
        ${prev ? `<button class="btn btn-secondary" onclick="openLesson('${subjectId}','${prev.id}')"><i class="fas fa-arrow-left"></i> Previous</button>` : '<div></div>'}
        ${next ? `<button class="btn btn-primary" onclick="openLesson('${subjectId}','${next.id}')">Next <i class="fas fa-arrow-right"></i></button>` : '<div></div>'}
      </div>
    </div>`;
}

function completeLesson(subjectId, lessonId) {
    if (!currentUser) return;
    const prog = DB.getProgress(currentUser.id);
    const key = subjectId + '-' + lessonId;
    if (!prog.completedLessons.includes(key)) {
        prog.completedLessons.push(key);
        currentUser.xp = (currentUser.xp || 0) + 50;
        currentUser.level = Math.floor(currentUser.xp / 300) + 1;
        showToast('Lesson completed! +50 XP', 'success');
    } else {
        showToast('Lesson already completed!', 'info');
    }
}

// ---- Render Profile ----
function renderProfile() {
    const area = document.getElementById('content-area');
    const avatar = currentUser.name.charAt(0).toUpperCase();
    area.innerHTML = `
    <div class="content-header"><h1>Profile</h1></div>
    <div class="card" style="max-width:600px">
      <div class="profile-header">
        <div class="profile-avatar-large">${avatar}</div>
        <div class="profile-info">
          <h2>${currentUser.name}</h2>
          <span class="profile-role"><i class="fas fa-${currentUser.role === 'teacher' ? 'chalkboard-teacher' : 'user-graduate'}"></i> ${currentUser.role}</span>
          <p class="profile-email">${currentUser.email}</p>
        </div>
      </div>
      ${currentUser.role === 'student' ? `
        <div class="xp-display mb-3">
          <div class="xp-level">${currentUser.level || 1}</div>
          <div class="xp-info">
            <h4>Level ${currentUser.level || 1}</h4>
            <div class="xp-text">${currentUser.xp || 0} XP total</div>
            <div class="progress-bar"><div class="progress-bar-fill" style="width:${((currentUser.xp || 0) % 300) / 3}%"></div></div>
          </div>
        </div>` : ''}
      <div class="form-group">
        <label>Joined</label>
        <input type="text" value="${currentUser.joined}" disabled />
      </div>
    </div>`;
}

// ---- Render Leaderboard ----
function renderLeaderboard() {
    const students = DB.getStudents().sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header"><h1><i class="fas fa-trophy" style="color:#fdcb6e"></i> Leaderboard</h1><p>Top students by XP earned</p></div>
    <div class="card" style="max-width:600px">
      <div class="leaderboard-list">
        ${students.map((s, i) => `
          <div class="leaderboard-item ${i < 3 ? 'top-' + (i + 1) : ''}">
            <div class="leaderboard-rank">${i + 1}</div>
            <div class="leaderboard-name">${s.name}</div>
            <div class="leaderboard-xp">${s.xp} XP</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

// ---- Loading Screen ----
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        checkSavedSession();
    }, 1800);
    document.addEventListener('click', (e) => {
        const dd = document.getElementById('notifications-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dd && dd.classList.contains('active') && !dd.contains(e.target) && !btn.contains(e.target)) {
            dd.classList.remove('active');
        }
    });
});
