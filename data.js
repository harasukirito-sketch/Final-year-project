/* =============================================
   EDUQUEST - Data Store (Mock Database)
   ============================================= */

const DB = {
  users: [
    { id: 1, name: 'Ahmad bin Ibrahim', email: 'ahmad@edu.my', password: 'pass123', role: 'student', xp: 1250, level: 5, joined: '2026-01-15' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@edu.my', password: 'pass123', role: 'student', xp: 980, level: 4, joined: '2026-01-20' },
    { id: 3, name: 'Raj Kumar', email: 'raj@edu.my', password: 'pass123', role: 'student', xp: 1500, level: 6, joined: '2026-01-10' },
    { id: 4, name: 'Nurul Aina', email: 'nurul@edu.my', password: 'pass123', role: 'student', xp: 750, level: 3, joined: '2026-02-01' },
    { id: 5, name: 'Lee Wei Ming', email: 'wei@edu.my', password: 'pass123', role: 'student', xp: 2100, level: 8, joined: '2026-01-05' },
    { id: 10, name: 'Cikgu Maria', email: 'maria@edu.my', password: 'pass123', role: 'teacher', xp: 0, level: 0, joined: '2025-09-01' },
    { id: 11, name: 'Encik Faizal', email: 'faizal@edu.my', password: 'pass123', role: 'teacher', xp: 0, level: 0, joined: '2025-09-01' },
  ],

  subjects: [
    { id: 's1', name: 'Mathematics', icon: 'fas fa-calculator', color: '#fdcb6e', lessons: 8, desc: 'Algebra, Geometry & Statistics' },
    { id: 's2', name: 'Physics', icon: 'fas fa-atom', color: '#ff7675', lessons: 7, desc: 'Forces, Energy & Waves' },
    { id: 's3', name: 'Chemistry', icon: 'fas fa-flask', color: '#74b9ff', lessons: 6, desc: 'Atoms, Reactions & Solutions' },
    { id: 's4', name: 'Biology', icon: 'fas fa-dna', color: '#55efc4', lessons: 7, desc: 'Cells, Genetics & Ecology' },
    { id: 's5', name: 'English', icon: 'fas fa-language', color: '#a29bfe', lessons: 5, desc: 'Grammar, Writing & Literature' },
    { id: 's6', name: 'History', icon: 'fas fa-landmark', color: '#e17055', lessons: 6, desc: 'Malaysian & World History' },
    { id: 's7', name: 'Bahasa Melayu', icon: 'fas fa-book', color: '#00cec9', lessons: 5, desc: 'Tatabahasa & Kesusasteraan' },
    { id: 's8', name: 'Add. Mathematics', icon: 'fas fa-square-root-alt', color: '#fd79a8', lessons: 8, desc: 'Calculus & Trigonometry' },
  ],

  lessons: {
    s1: [
      { id: 'l1', title: 'Quadratic Expressions', order: 1, duration: '25 min', type: 'lesson',
        content: `<h2>Quadratic Expressions</h2>
        <p>A quadratic expression is a polynomial of degree 2. The general form is <strong>ax² + bx + c</strong>, where a ≠ 0.</p>
        <div class="key-point"><strong>Key Point:</strong> The highest power of the variable in a quadratic expression is 2.</div>
        <h2>Examples of Quadratic Expressions</h2>
        <ul><li>3x² + 2x + 1</li><li>x² - 5x + 6</li><li>2x² + 7</li></ul>
        <h2>Factorisation</h2>
        <p>Factorisation is the reverse process of expansion. We express a quadratic expression as a product of two linear factors.</p>
        <div class="key-point"><strong>Example:</strong> x² + 5x + 6 = (x + 2)(x + 3)</div>
        <div class="video-embed"><i class="fas fa-play-circle"></i> Video: Understanding Quadratic Expressions</div>` },
      { id: 'l2', title: 'Quadratic Equations', order: 2, duration: '30 min', type: 'lesson',
        content: `<h2>Quadratic Equations</h2>
        <p>A quadratic equation has the form <strong>ax² + bx + c = 0</strong>.</p>
        <div class="key-point"><strong>Methods of solving:</strong><br>1. Factorisation<br>2. Completing the square<br>3. Quadratic formula</div>
        <h2>The Quadratic Formula</h2>
        <p>x = (-b ± √(b² - 4ac)) / 2a</p>
        <p>The discriminant <strong>D = b² - 4ac</strong> determines the nature of roots.</p>
        <div class="video-embed"><i class="fas fa-play-circle"></i> Video: Solving Quadratic Equations</div>` },
      { id: 'l3', title: 'Sets and Venn Diagrams', order: 3, duration: '20 min', type: 'lesson',
        content: `<h2>Sets</h2><p>A set is a well-defined collection of objects. Sets can be described using set-builder notation or listing.</p>
        <div class="key-point"><strong>Operations:</strong> Union (∪), Intersection (∩), Complement (A')</div>
        <h2>Venn Diagrams</h2><p>Venn diagrams visually represent relationships between sets using overlapping circles.</p>` },
      { id: 'l4', title: 'Mathematical Reasoning', order: 4, duration: '25 min', type: 'lesson',
        content: '<h2>Mathematical Reasoning</h2><p>Learn about statements, negation, compound statements, implications, and arguments in mathematics.</p>' },
      { id: 'l5', title: 'Indices and Logarithms', order: 5, duration: '35 min', type: 'lesson',
        content: '<h2>Indices and Logarithms</h2><p>Laws of indices, logarithmic functions, and their applications in problem solving.</p>' },
    ],
    s2: [
      { id: 'l1', title: 'Forces and Motion', order: 1, duration: '30 min', type: 'lesson',
        content: '<h2>Forces and Motion</h2><p>Understanding Newton\'s Laws of Motion, friction, gravity, and their effects on objects.</p><div class="key-point"><strong>Newton\'s 2nd Law:</strong> F = ma</div>' },
      { id: 'l2', title: 'Pressure', order: 2, duration: '25 min', type: 'lesson',
        content: '<h2>Pressure</h2><p>Pressure = Force / Area. Learn about atmospheric pressure, liquid pressure, and gas pressure.</p>' },
      { id: 'l3', title: 'Energy and Power', order: 3, duration: '28 min', type: 'lesson',
        content: '<h2>Energy and Power</h2><p>Forms of energy, conservation of energy, and calculating power.</p>' },
    ],
    s3: [
      { id: 'l1', title: 'Matter and Atoms', order: 1, duration: '20 min', type: 'lesson',
        content: '<h2>Matter and Atoms</h2><p>The structure of atoms, proton number, nucleon number, and electron arrangement.</p>' },
      { id: 'l2', title: 'The Periodic Table', order: 2, duration: '25 min', type: 'lesson',
        content: '<h2>The Periodic Table</h2><p>Groups, periods, and trends in the Periodic Table of Elements.</p>' },
      { id: 'l3', title: 'Chemical Bonds', order: 3, duration: '30 min', type: 'lesson',
        content: '<h2>Chemical Bonds</h2><p>Ionic bonds, covalent bonds, and metallic bonds explained with diagrams.</p>' },
    ],
    s4: [
      { id: 'l1', title: 'Cell Structure', order: 1, duration: '25 min', type: 'lesson',
        content: '<h2>Cell Structure</h2><p>Animal cells vs plant cells: organelles and their functions.</p>' },
      { id: 'l2', title: 'Cell Division', order: 2, duration: '30 min', type: 'lesson',
        content: '<h2>Cell Division</h2><p>Mitosis and meiosis: stages and significance.</p>' },
    ],
    s5: [
      { id: 'l1', title: 'Parts of Speech', order: 1, duration: '20 min', type: 'lesson',
        content: '<h2>Parts of Speech</h2><p>Nouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.</p>' },
      { id: 'l2', title: 'Essay Writing', order: 2, duration: '35 min', type: 'lesson',
        content: '<h2>Essay Writing</h2><p>Structure, planning, and techniques for writing effective essays.</p>' },
    ],
    s6: [
      { id: 'l1', title: 'The Malacca Sultanate', order: 1, duration: '30 min', type: 'lesson',
        content: '<h2>The Malacca Sultanate</h2><p>The founding, administration, and fall of the Malacca Sultanate.</p>' },
    ],
    s7: [
      { id: 'l1', title: 'Morfologi', order: 1, duration: '25 min', type: 'lesson',
        content: '<h2>Morfologi</h2><p>Kajian tentang pembentukan kata dalam Bahasa Melayu.</p>' },
    ],
    s8: [
      { id: 'l1', title: 'Functions', order: 1, duration: '30 min', type: 'lesson',
        content: '<h2>Functions</h2><p>Types of relations, functions, composite functions, and inverse functions.</p>' },
      { id: 'l2', title: 'Quadratic Functions', order: 2, duration: '35 min', type: 'lesson',
        content: '<h2>Quadratic Functions</h2><p>Graphs, maximum/minimum values, and quadratic inequalities.</p>' },
    ],
  },

  quizzes: {
    s1: [
      { id: 'q1', lessonId: 'l1', title: 'Quadratic Expressions Quiz', questions: [
        { q: 'What is the degree of a quadratic expression?', options: ['1', '2', '3', '4'], answer: 1 },
        { q: 'Factorise: x² + 7x + 12', options: ['(x+3)(x+4)', '(x+2)(x+6)', '(x+1)(x+12)', '(x+6)(x+2)'], answer: 0 },
        { q: 'Expand: (x+5)(x-3)', options: ['x²+2x-15', 'x²-2x-15', 'x²+2x+15', 'x²-8x-15'], answer: 0 },
        { q: 'Which is NOT a quadratic expression?', options: ['3x²+1', 'x²-4x', '2x³+x', '5x²-2x+7'], answer: 2 },
        { q: 'The coefficient of x² in 4x²-3x+2 is:', options: ['2', '-3', '4', '1'], answer: 2 },
      ]},
      { id: 'q2', lessonId: 'l2', title: 'Quadratic Equations Quiz', questions: [
        { q: 'Solve: x² - 5x + 6 = 0', options: ['x=2,3', 'x=1,6', 'x=-2,-3', 'x=-1,6'], answer: 0 },
        { q: 'The quadratic formula is x = ?', options: ['(-b±√(b²-4ac))/2a', '(-b±√(b²+4ac))/2a', '(b±√(b²-4ac))/2a', '(-b±√(b²-4ac))/a'], answer: 0 },
        { q: 'If discriminant < 0, the equation has:', options: ['Two real roots', 'One real root', 'No real roots', 'Infinite roots'], answer: 2 },
      ]},
    ],
    s2: [
      { id: 'q1', lessonId: 'l1', title: 'Forces and Motion Quiz', questions: [
        { q: 'Newton\'s Second Law states:', options: ['F=ma', 'F=mv', 'F=mg', 'F=mc²'], answer: 0 },
        { q: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer: 1 },
        { q: 'Inertia is the tendency of an object to:', options: ['Accelerate', 'Resist change in motion', 'Move faster', 'Stop immediately'], answer: 1 },
      ]},
    ],
    s3: [
      { id: 'q1', lessonId: 'l1', title: 'Matter and Atoms Quiz', questions: [
        { q: 'The proton number is also known as:', options: ['Mass number', 'Atomic number', 'Nucleon number', 'Electron number'], answer: 1 },
        { q: 'Electrons are found in:', options: ['Nucleus', 'Electron shells', 'Protons', 'Neutrons'], answer: 1 },
      ]},
    ],
    s4: [
      { id: 'q1', lessonId: 'l1', title: 'Cell Structure Quiz', questions: [
        { q: 'Which organelle is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], answer: 2 },
        { q: 'Plant cells have but animal cells do not:', options: ['Nucleus', 'Cell wall', 'Mitochondria', 'Cytoplasm'], answer: 1 },
      ]},
    ],
    s5: [], s6: [], s7: [], s8: [],
  },

  // Student progress tracking
  progress: {
    1: { completedLessons: ['s1-l1', 's1-l2', 's2-l1', 's3-l1'], quizScores: { 's1-q1': 80, 's1-q2': 60, 's2-q1': 100 } },
    2: { completedLessons: ['s1-l1', 's4-l1'], quizScores: { 's1-q1': 90, 's4-q1': 70 } },
    3: { completedLessons: ['s1-l1', 's1-l2', 's1-l3', 's2-l1', 's2-l2', 's3-l1', 's3-l2'], quizScores: { 's1-q1': 100, 's1-q2': 90, 's2-q1': 80, 's3-q1': 100 } },
    4: { completedLessons: ['s1-l1'], quizScores: { 's1-q1': 60 } },
    5: { completedLessons: ['s1-l1', 's1-l2', 's1-l3', 's1-l4', 's2-l1', 's2-l2', 's2-l3', 's3-l1', 's3-l2', 's3-l3', 's4-l1', 's4-l2'], quizScores: { 's1-q1': 100, 's1-q2': 100, 's2-q1': 80, 's3-q1': 90, 's4-q1': 100 } },
  },

  notifications: [
    { id: 1, icon: 'purple', iconClass: 'fas fa-trophy', text: 'You earned the "Quick Learner" badge!', time: '2 hours ago' },
    { id: 2, icon: 'green', iconClass: 'fas fa-check', text: 'Quiz "Quadratic Expressions" graded: 80%', time: '5 hours ago' },
    { id: 3, icon: 'blue', iconClass: 'fas fa-book', text: 'New lesson available: Indices and Logarithms', time: '1 day ago' },
  ],

  getUser(email) { return this.users.find(u => u.email === email); },
  getStudents() { return this.users.filter(u => u.role === 'student'); },
  getSubject(id) { return this.subjects.find(s => s.id === id); },
  getLessons(subjectId) { return this.lessons[subjectId] || []; },
  getQuizzes(subjectId) { return this.quizzes[subjectId] || []; },
  getProgress(userId) { return this.progress[userId] || { completedLessons: [], quizScores: {} }; },
};
