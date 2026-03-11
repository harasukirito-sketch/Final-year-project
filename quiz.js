/* =============================================
   EDUQUEST - Quiz Engine
   ============================================= */

let quizState = {
    subjectId: null,
    quizId: null,
    quiz: null,
    currentQuestion: 0,
    answers: [],
    startTime: null,
    timerInterval: null,
};

function startQuiz(subjectId, quizId) {
    const quiz = DB.getQuizzes(subjectId).find(q => q.id === quizId);
    if (!quiz || !quiz.questions.length) {
        showToast('Quiz not available.', 'error');
        return;
    }
    quizState = {
        subjectId, quizId, quiz,
        currentQuestion: 0,
        answers: new Array(quiz.questions.length).fill(-1),
        startTime: Date.now(),
        timerInterval: null,
    };
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const { quiz, currentQuestion, answers } = quizState;
    const q = quiz.questions[currentQuestion];
    const total = quiz.questions.length;
    const area = document.getElementById('content-area');
    const subject = DB.getSubject(quizState.subjectId);
    const progress = ((currentQuestion + 1) / total) * 100;

    area.innerHTML = `
    <div class="content-header">
      <div class="breadcrumb">
        <a href="#" onclick="navigateTo('subjects')">Subjects</a>
        <i class="fas fa-chevron-right"></i>
        <a href="#" onclick="openSubject('${quizState.subjectId}')">${subject?.name || ''}</a>
        <i class="fas fa-chevron-right"></i> ${quiz.title}
      </div>
    </div>
    <div class="quiz-container">
      <div class="quiz-header">
        <div class="quiz-question-number">Q${currentQuestion + 1} of ${total}</div>
        <div class="quiz-progress">
          <div class="progress-bar">
            <div class="progress-bar-fill accent" style="width:${progress}%"></div>
          </div>
        </div>
        <div class="quiz-timer" id="quiz-timer">
          <i class="fas fa-clock"></i> <span id="timer-display">00:00</span>
        </div>
      </div>
      <div class="quiz-card">
        <h3>${q.q}</h3>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <div class="quiz-option ${answers[currentQuestion] === i ? 'selected' : ''}"
                 onclick="selectQuizOption(${i})">
              <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="quiz-actions">
        ${currentQuestion > 0 ?
            `<button class="btn btn-secondary" onclick="prevQuestion()">
            <i class="fas fa-arrow-left"></i> Previous
          </button>` : '<div></div>'}
        ${currentQuestion < total - 1 ?
            `<button class="btn btn-primary" onclick="nextQuestion()">
            Next <i class="fas fa-arrow-right"></i>
          </button>` :
            `<button class="btn btn-success" onclick="submitQuiz()">
            <i class="fas fa-check"></i> Submit Quiz
          </button>`}
      </div>
    </div>`;

    // Start timer
    if (quizState.timerInterval) clearInterval(quizState.timerInterval);
    quizState.timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const secs = String(elapsed % 60).padStart(2, '0');
    const display = document.getElementById('timer-display');
    if (display) display.textContent = `${mins}:${secs}`;
}

function selectQuizOption(index) {
    quizState.answers[quizState.currentQuestion] = index;
    renderQuizQuestion();
}

function nextQuestion() {
    if (quizState.currentQuestion < quizState.quiz.questions.length - 1) {
        quizState.currentQuestion++;
        renderQuizQuestion();
    }
}

function prevQuestion() {
    if (quizState.currentQuestion > 0) {
        quizState.currentQuestion--;
        renderQuizQuestion();
    }
}

function submitQuiz() {
    const unanswered = quizState.answers.filter(a => a === -1).length;
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }

    clearInterval(quizState.timerInterval);

    const { quiz, answers, subjectId, quizId } = quizState;
    let correct = 0;
    quiz.questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
    });
    const total = quiz.questions.length;
    const score = Math.round((correct / total) * 100);
    const elapsed = Math.floor((Date.now() - quizState.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    // Save score
    if (currentUser) {
        const prog = DB.getProgress(currentUser.id);
        prog.quizScores[subjectId + '-' + quizId] = score;
        // Award XP
        const xpEarned = Math.round(score / 2);
        currentUser.xp = (currentUser.xp || 0) + xpEarned;
        currentUser.level = Math.floor(currentUser.xp / 300) + 1;
    }

    renderQuizResult(score, correct, total, mins, secs);
}

function renderQuizResult(score, correct, total, mins, secs) {
    const { quiz, answers, subjectId } = quizState;
    const subject = DB.getSubject(subjectId);
    let grade = '', gradeColor = '', message = '';
    if (score >= 90) { grade = 'A+'; gradeColor = 'var(--success)'; message = 'Outstanding! You\'re a star! ⭐'; }
    else if (score >= 80) { grade = 'A'; gradeColor = 'var(--success)'; message = 'Excellent work! Keep it up! 🎉'; }
    else if (score >= 70) { grade = 'B'; gradeColor = 'var(--accent)'; message = 'Good job! Keep learning! 👍'; }
    else if (score >= 60) { grade = 'C'; gradeColor = 'var(--warning)'; message = 'Not bad! Review the topic. 📖'; }
    else if (score >= 50) { grade = 'D'; gradeColor = 'var(--warning-dark)'; message = 'You can do better! Try again. 💪'; }
    else { grade = 'F'; gradeColor = 'var(--danger)'; message = 'Don\'t give up! Review and retry. 📚'; }

    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-result">
        <div class="quiz-result-score" style="border-color:${gradeColor}">
          <span class="score-value" style="color:${gradeColor}">${score}%</span>
          <span class="score-label">Grade: ${grade}</span>
        </div>
        <h2>${message}</h2>
        <p>You scored ${correct} out of ${total} in ${quiz.title}</p>
        <div class="quiz-result-stats">
          <div class="quiz-result-stat">
            <div class="value" style="color:var(--success)">${correct}</div>
            <div class="label">Correct</div>
          </div>
          <div class="quiz-result-stat">
            <div class="value" style="color:var(--danger)">${total - correct}</div>
            <div class="label">Wrong</div>
          </div>
          <div class="quiz-result-stat">
            <div class="value" style="color:var(--accent)">${mins}:${String(secs).padStart(2, '0')}</div>
            <div class="label">Time</div>
          </div>
          <div class="quiz-result-stat">
            <div class="value" style="color:var(--primary-light)">+${Math.round(score / 2)}</div>
            <div class="label">XP Earned</div>
          </div>
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="reviewQuiz()"><i class="fas fa-eye"></i> Review Answers</button>
          <button class="btn btn-accent" onclick="startQuiz('${subjectId}','${quizState.quizId}')"><i class="fas fa-redo"></i> Retry</button>
          <button class="btn btn-secondary" onclick="openSubject('${subjectId}')"><i class="fas fa-arrow-left"></i> Back to Subject</button>
        </div>
      </div>
    </div>`;
}

function reviewQuiz() {
    const { quiz, answers } = quizState;
    const area = document.getElementById('content-area');
    area.innerHTML = `
    <div class="content-header">
      <h1>Review: ${quiz.title}</h1>
      <p>Check your answers</p>
    </div>
    <div class="quiz-container">
      ${quiz.questions.map((q, i) => {
        const userAnswer = answers[i];
        const isCorrect = userAnswer === q.answer;
        return `
          <div class="quiz-card">
            <h3 style="font-size:1rem;color:var(--text-muted);margin-bottom:0.5rem">Question ${i + 1}</h3>
            <h3>${q.q}</h3>
            <div class="quiz-options">
              ${q.options.map((opt, j) => {
            let cls = '';
            if (j === q.answer) cls = 'correct';
            else if (j === userAnswer && !isCorrect) cls = 'wrong';
            return `<div class="quiz-option ${cls}">
                  <span class="quiz-option-letter">${String.fromCharCode(65 + j)}</span>
                  <span>${opt}</span>
                  ${j === q.answer ? '<i class="fas fa-check" style="margin-left:auto;color:var(--success)"></i>' : ''}
                  ${j === userAnswer && !isCorrect ? '<i class="fas fa-times" style="margin-left:auto;color:var(--danger)"></i>' : ''}
                </div>`;
        }).join('')}
            </div>
          </div>`;
    }).join('')}
      <div style="display:flex;gap:1rem;justify-content:center">
        <button class="btn btn-primary" onclick="openSubject('${quizState.subjectId}')"><i class="fas fa-arrow-left"></i> Back to Subject</button>
        <button class="btn btn-accent" onclick="startQuiz('${quizState.subjectId}','${quizState.quizId}')"><i class="fas fa-redo"></i> Retry Quiz</button>
      </div>
    </div>`;
}
