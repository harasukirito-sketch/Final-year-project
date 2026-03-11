/* =============================================
   EDUQUEST - Charts (Pure CSS/JS)
   ============================================= */

function renderStudentBarChart(prog) {
    const container = document.getElementById('student-bar-chart');
    if (!container) return;
    const data = DB.subjects.slice(0, 6).map(s => {
        const lessons = DB.getLessons(s.id);
        const done = prog.completedLessons.filter(l => l.startsWith(s.id + '-')).length;
        const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
        return { label: s.name.substring(0, 5), value: pct, color: s.color };
    });
    renderBarChart(container, data);
}

function renderTeacherBarChart(students) {
    const container = document.getElementById('teacher-bar-chart');
    if (!container) return;
    const data = students.map(s => {
        const p = DB.getProgress(s.id);
        const scores = Object.values(p.quizScores);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { label: s.name.split(' ')[0].substring(0, 6), value: avg };
    });
    renderBarChart(container, data);
}

function renderBarChart(container, data) {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    container.innerHTML = data.map(d => {
        const height = Math.max((d.value / 100) * 100, 3);
        return `<div class="bar-item">
      <div class="bar-value">${d.value}%</div>
      <div class="bar-fill" style="height:${height}%;${d.color ? `background:linear-gradient(135deg, ${d.color}, ${d.color}88)` : ''}"></div>
      <div class="bar-label">${d.label}</div>
    </div>`;
    }).join('');

    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.bar-fill').forEach(bar => {
            const h = bar.style.height;
            bar.style.height = '3%';
            requestAnimationFrame(() => { bar.style.height = h; });
        });
    }, 50);
}

function renderTeacherDonutChart(students) {
    const container = document.getElementById('teacher-donut-chart');
    if (!container) return;

    // Calculate performance distribution
    let high = 0, mid = 0, low = 0;
    students.forEach(s => {
        const p = DB.getProgress(s.id);
        const scores = Object.values(p.quizScores);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        if (avg >= 80) high++;
        else if (avg >= 50) mid++;
        else low++;
    });

    const total = students.length || 1;
    const highPct = (high / total) * 100;
    const midPct = (mid / total) * 100;
    const lowPct = (low / total) * 100;

    const r = 70;
    const c = 2 * Math.PI * r;

    container.innerHTML = `
    <div class="donut-chart">
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="${r}" stroke="var(--bg-input)" stroke-width="20" />
        <circle cx="90" cy="90" r="${r}" stroke="var(--danger-light)" stroke-width="20"
          stroke-dasharray="${c}" stroke-dashoffset="0" />
        <circle cx="90" cy="90" r="${r}" stroke="var(--warning)" stroke-width="20"
          stroke-dasharray="${c}" stroke-dashoffset="-${(lowPct / 100) * c}" />
        <circle cx="90" cy="90" r="${r}" stroke="var(--success)" stroke-width="20"
          stroke-dasharray="${c}" stroke-dashoffset="-${((lowPct + midPct) / 100) * c}" />
      </svg>
      <div class="donut-center">
        <div class="value">${total}</div>
        <div class="label">Students</div>
      </div>
    </div>
    <div class="chart-legend">
      <div class="legend-item"><div class="legend-dot" style="background:var(--success)"></div> High (${high})</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--warning)"></div> Mid (${mid})</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--danger-light)"></div> Low (${low})</div>
    </div>`;
}
