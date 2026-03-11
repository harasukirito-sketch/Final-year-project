/* =============================================
   EDUQUEST - Authentication Module
   ============================================= */

let currentUser = null;

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const user = DB.getUser(email);
    if (!user) { showToast('Account not found. Please register first.', 'error'); return; }
    if (user.password !== password) { showToast('Incorrect password.', 'error'); return; }
    currentUser = user;
    localStorage.setItem('eduquest_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`, 'success');
    setTimeout(() => { initApp(); showPage('page-app'); }, 500);
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    if (DB.getUser(email)) { showToast('Email already registered.', 'error'); return; }
    const newUser = {
        id: DB.users.length + 1, name, email, password, role,
        xp: 0, level: 1, joined: new Date().toISOString().split('T')[0]
    };
    DB.users.push(newUser);
    DB.progress[newUser.id] = { completedLessons: [], quizScores: {} };
    currentUser = newUser;
    localStorage.setItem('eduquest_user', JSON.stringify(newUser));
    showToast(`Welcome to EduQuest, ${name}!`, 'success');
    setTimeout(() => { initApp(); showPage('page-app'); }, 500);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('eduquest_user');
    showToast('Logged out successfully.', 'info');
    showPage('page-landing');
}

function selectRole(role) {
    document.getElementById('role-student-label').classList.toggle('active', role === 'student');
    document.getElementById('role-teacher-label').classList.toggle('active', role === 'teacher');
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text'; icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password'; icon.className = 'fas fa-eye';
    }
}

function checkSavedSession() {
    const saved = localStorage.getItem('eduquest_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        const dbUser = DB.users.find(u => u.id === currentUser.id);
        if (dbUser) { currentUser = dbUser; initApp(); showPage('page-app'); return; }
    }
}
