/* =============================================
   EDUQUEST - Student Dashboard & Progress
   ============================================= */

function renderStudentDashboard() {
    const prog = DB.getProgress(currentUser.id);
    const totalLessons = Object.values(DB.lessons).reduce((s, l) => s + l.length, 0);
    const completed = prog.completedLessons.length;
    const quizCount = Object.keys(prog.quizScores).length;
    const avgScore = quizCount ? Math.round(Object.values(prog.quizScores).reduce((a, b) => a + b, 0) / quizCount) : 0;
    const area = document.getElementById('content-area');

    area.innerHTML = `
    <div class="welcome-banner">
      <div class="welcome-text">
        <h1>Welcome back, ${currentUser.name.split(' ')[0]}! 👋</h1>
        <p>Continue your learning journey. You're on Level ${currentUser.level || 1}!</p>
      </div>
      <div class="welcome-icon"><i class="fas fa-rocket"></i></div>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-card-icon purple"><i class="fas fa-book-open"></i></div>
        <div class="stat-card-info"><h4>Lessons Done</h4><div class="stat-value">${completed}</div><div class="stat-change">of ${totalLessons} total</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon teal"><i class="fas fa-question-circle"></i></div>
        <div class="stat-card-info"><h4>Quizzes Taken</h4><div class="stat-value">${quizCount}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green"><i class="fas fa-percentage"></i></div>
        <div class="stat-card-info"><h4>Avg Score</h4><div class="stat-value">${avgScore}%</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange"><i class="fas fa-star"></i></div>
        <div class="stat-card-info"><h4>Total XP</h4><div class="stat-value">${currentUser.xp || 0}</div></div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div>
        <div class="chart-container mb-3">
          <h3>Performance by Subject</h3>
          <div class="bar-chart" id="student-bar-chart"></div>
        </div>
        <div class="card">
          <h3 style="margin-bottom:1rem">Continue Learning</h3>
          <div class="grid-auto">
            ${DB.subjects.slice(0, 4).map(s => `
              <div class="subject-card" onclick="openSubject('${s.id}')" style="cursor:pointer">
                <div class="subject-card-header" style="background:linear-gradient(135deg,${s.color}22,${s.color}08);height:80px">
                  <i class="${s.icon}" style="color:${s.color};font-size:2rem"></i>
                </div>
                <div class="subject-card-body" style="padding:1rem">
                  <h3 style="font-size:0.95rem">${s.name}</h3>
                  <div class="progress-bar" style="margin-top:0.5rem"><div class="progress-bar-fill" style="width:${getSubjectProgress(s.id)}%"></div></div>
                  <div class="progress-bar-label"><span>${getSubjectProgress(s.id)}% complete</span></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="card mb-3">
          <h3 style="margin-bottom:1rem">Your Level</h3>
          <div class="xp-display" style="border:none;padding:0">
            <div class="xp-level">${currentUser.level || 1}</div>
            <div class="xp-info">
              <h4>Level ${currentUser.level || 1}</h4>
              <div class="xp-text">${currentUser.xp || 0} / ${((currentUser.level || 1)) * 300} XP</div>
              <div class="progress-bar"><div class="progress-bar-fill accent" style="width:${((currentUser.xp || 0) % 300) / 3}%"></div></div>
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <h3 style="margin-bottom:1rem">Recent Activity</h3>
          <div class="activity-feed">
            ${generateStudentActivity(prog)}
          </div>
        </div>
        <div class="card">
          <h3 style="margin-bottom:1rem">Quick Actions</h3>
          <button class="btn btn-primary btn-block mb-2" onclick="navigateTo('subjects')"><i class="fas fa-book-open"></i> Browse Subjects</button>
          <button class="btn btn-secondary btn-block mb-2" onclick="navigateTo('my-progress')"><i class="fas fa-chart-line"></i> View Progress</button>
          <button class="btn btn-secondary btn-block" onclick="navigateTo('leaderboard')"><i class="fas fa-trophy"></i> Leaderboard</button>
        </div>
      </div>
    </div>`;

    setTimeout(() => renderStudentBarChart(prog), 100);
}

function getSubjectProgress(subjectId) {
    if (!currentUser) return 0;
    const prog = DB.getProgress(currentUser.id);
    const lessons = DB.getLessons(subjectId);
    if (!lessons.length) return 0;
    const done = prog.completedLessons.filter(l => l.startsWith(subjectId + '-')).length;
    return Math.round((done / lessons.length) * 100);
}

function generateStudentActivity(prog) {
    const activities = [];
    prog.completedLessons.slice(-3).reverse().forEach(key => {
        const [sid, lid] = key.split('-');
        const subj = DB.getSubject(sid);
        const lesson = (DB.getLessons(sid) || []).find(l => l.id === lid);
        if (subj && lesson) {
            activities.push(`<div class="activity-item"><div class="activity-icon lesson"><i class="fas fa-book"></i></div><div class="activity-content"><p>Completed <strong>${lesson.title}</strong> in ${subj.name}</p><div class="activity-time">Recently</div></div></div>`);
        }
    });
    Object.entries(prog.quizScores).slice(-2).forEach(([key, score]) => {
        const [sid] = key.split('-');
        const subj = DB.getSubject(sid);
        if (subj) {
            activities.push(`<div class="activity-item"><div class="activity-icon quiz"><i class="fas fa-check-circle"></i></div><div class="activity-content"><p>Scored <strong>${score}%</strong> in ${subj.name} quiz</p><div class="activity-time">Recently</div></div></div>`);
        }
    });
    return activities.length ? activities.join('') : '<div class="empty-state" style="padding:1rem"><p>No recent activity</p></div>';
}

// ---- My Progress Page ----
function renderMyProgress() {
    const prog = DB.getProgress(currentUser.id);
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header"><h1>My Progress</h1><p>Track your learning journey across all subjects</p></div>
    <div class="grid-2 mb-4">
      ${DB.subjects.map(s => {
        const pct = getSubjectProgress(s.id);
        const quizzes = DB.getQuizzes(s.id);
        const scores = quizzes.map(q => prog.quizScores[s.id + '-' + q.id]).filter(x => x !== undefined);
        const avgQ = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        return `<div class="card">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
            <div style="width:44px;height:44px;border-radius:var(--border-radius-sm);background:${s.color}22;display:flex;align-items:center;justify-content:center">
              <i class="${s.icon}" style="color:${s.color};font-size:1.2rem"></i>
            </div>
            <div><h3 style="font-size:1rem">${s.name}</h3><p style="font-size:0.8rem;color:var(--text-muted)">${s.desc}</p></div>
          </div>
          <div class="progress-bar mb-1"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
          <div class="progress-bar-label"><span>${pct}% complete</span><span>${prog.completedLessons.filter(l => l.startsWith(s.id + '-')).length}/${DB.getLessons(s.id).length} lessons</span></div>
          ${avgQ !== null ? `<p style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem">Quiz avg: <strong class="${avgQ >= 80 ? 'score-high' : avgQ >= 50 ? 'score-mid' : 'score-low'}">${avgQ}%</strong></p>` : ''}
          <button class="btn btn-sm btn-secondary mt-2" onclick="openSubject('${s.id}')">Continue <i class="fas fa-arrow-right"></i></button>
        </div>`;
    }).join('')}
    </div>`;
}
