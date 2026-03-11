# EDUQUEST: Level Up Your Learning
## System Documentation

---

## 1. System Structure

```
Project FYP/
├── index.html              # Main HTML entry point (SPA)
├── css/
│   ├── style.css           # Core design system, variables, landing page, auth
│   ├── components.css      # Reusable UI components (buttons, cards, quiz, charts)
│   ├── dashboard.css       # Dashboard layout (sidebar, topbar, content area)
│   └── responsive.css      # Mobile-responsive breakpoints
├── js/
│   ├── data.js             # Mock database (users, subjects, lessons, quizzes, progress)
│   ├── auth.js             # Authentication (login, register, logout, session)
│   ├── app.js              # Main app controller (navigation, rendering, utilities)
│   ├── student.js          # Student dashboard & progress tracking
│   ├── teacher.js          # Teacher dashboard & management tools
│   ├── quiz.js             # Quiz engine (start, answer, submit, review)
│   └── charts.js           # Chart rendering (bar charts, donut charts)
└── docs/
    └── README.md           # This documentation file
```

---

## 2. Database Design (ER Schema)

### Users Table
| Field     | Type    | Description                    |
|-----------|---------|--------------------------------|
| id        | INT PK  | Unique user identifier         |
| name      | VARCHAR | Full name                      |
| email     | VARCHAR | Email (unique, used for login) |
| password  | VARCHAR | Hashed password                |
| role      | ENUM    | 'student' or 'teacher'         |
| xp        | INT     | Experience points (students)   |
| level     | INT     | Current level (students)       |
| joined    | DATE    | Registration date              |

### Subjects Table
| Field   | Type    | Description               |
|---------|---------|---------------------------|
| id      | VARCHAR PK | Subject identifier     |
| name    | VARCHAR | Subject name               |
| icon    | VARCHAR | Font Awesome icon class    |
| color   | VARCHAR | Theme color (hex)          |
| desc    | TEXT    | Subject description        |

### Lessons Table
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | VARCHAR PK | Lesson identifier      |
| subject_id | VARCHAR FK | References subjects.id |
| title      | VARCHAR | Lesson title               |
| order_num  | INT     | Display order              |
| duration   | VARCHAR | Estimated duration         |
| type       | VARCHAR | Content type               |
| content    | TEXT    | HTML lesson content        |

### Quizzes Table
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | VARCHAR PK | Quiz identifier        |
| subject_id | VARCHAR FK | References subjects.id |
| lesson_id  | VARCHAR FK | References lessons.id  |
| title      | VARCHAR | Quiz title                 |

### Quiz Questions Table
| Field    | Type    | Description                |
|----------|---------|----------------------------|
| id       | INT PK  | Question identifier        |
| quiz_id  | VARCHAR FK | References quizzes.id   |
| question | TEXT    | Question text              |
| options  | JSON    | Array of answer options    |
| answer   | INT     | Index of correct answer    |

### Student Progress Table
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | INT PK  | Progress record ID        |
| user_id    | INT FK  | References users.id       |
| lesson_key | VARCHAR | "{subject_id}-{lesson_id}"|
| completed  | BOOLEAN | Completion status         |
| completed_at | DATETIME | When completed         |

### Quiz Scores Table
| Field      | Type    | Description               |
|------------|---------|---------------------------|
| id         | INT PK  | Score record ID           |
| user_id    | INT FK  | References users.id       |
| quiz_key   | VARCHAR | "{subject_id}-{quiz_id}" |
| score      | INT     | Score percentage (0-100)  |
| taken_at   | DATETIME | When quiz was taken      |

### Entity Relationships
```
Users (1) -----< (M) StudentProgress
Users (1) -----< (M) QuizScores
Subjects (1) --< (M) Lessons
Subjects (1) --< (M) Quizzes
Quizzes (1) ---< (M) QuizQuestions
```

---

## 3. Main Pages

| Page                 | URL/View          | Role     | Description                                    |
|----------------------|-------------------|----------|------------------------------------------------|
| Landing Page         | page-landing      | Public   | Hero section, features, call to action         |
| Login                | page-login        | Public   | Email/password login form                      |
| Register             | page-register     | Public   | Name, email, password, role selector           |
| Student Dashboard    | dashboard         | Student  | Welcome banner, stats, charts, activity feed   |
| Teacher Dashboard    | dashboard         | Teacher  | Class stats, student table, performance charts |
| Subjects             | subjects          | Both     | Grid of Form 4 subjects with details           |
| Subject Detail       | (dynamic)         | Both     | Lessons list with tabs for quizzes             |
| Lesson Viewer        | (dynamic)         | Both     | Rich HTML lesson content with navigation       |
| Quiz                 | (dynamic)         | Student  | Interactive quiz with timer and options         |
| Quiz Results         | (dynamic)         | Student  | Score, grade, XP earned, review answers        |
| My Progress          | my-progress       | Student  | Progress across all subjects with scores       |
| Leaderboard          | leaderboard       | Student  | XP-based student ranking                       |
| Manage Lessons       | manage-lessons    | Teacher  | CRUD operations for lessons                    |
| Manage Quizzes       | manage-quizzes    | Teacher  | CRUD operations for quizzes                    |
| Upload Materials     | upload-materials  | Teacher  | File upload interface for resources            |
| Student Progress     | student-progress  | Teacher  | Monitor individual student performance         |
| Quiz Results         | quiz-results      | Teacher  | View all quiz submissions and scores           |
| Profile              | profile           | Both     | User info, XP/level display                    |

---

## 4. Key Features

### Authentication & Roles
- Email/password registration and login
- Role selection: Student or Teacher
- Session persistence via localStorage
- Role-based sidebar navigation and dashboard

### Student Features
- Browse Form 4 subjects (8 subjects)
- Interactive lessons with rich HTML content
- Timed quizzes with instant grading
- Progress tracking per subject
- XP and leveling system
- Leaderboard ranking

### Teacher Features
- Add/edit/delete lessons for any subject
- Create quizzes with multiple-choice questions
- Upload learning materials
- Monitor student progress with detailed views
- View quiz results with performance indicators
- Visual analytics (bar charts, donut charts)

### Design & UX
- Dark theme with purple/teal accent colors
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and micro-interactions
- Glassmorphism and gradient effects
- Toast notifications for feedback
- Modal dialogs for forms

---

## 5. Demo Accounts

| Role    | Email           | Password |
|---------|-----------------|----------|
| Student | ahmad@edu.my    | pass123  |
| Student | wei@edu.my      | pass123  |
| Teacher | maria@edu.my    | pass123  |
| Teacher | faizal@edu.my   | pass123  |

---

## 6. Technology Stack

| Layer      | Technology                      |
|------------|--------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript |
| Typography | Google Fonts (Inter, Outfit)    |
| Icons      | Font Awesome 6.5                |
| Storage    | localStorage (client-side)      |
| Design     | CSS Variables, Flexbox, Grid    |

---

## 7. How to Run

1. Open `index.html` in any modern web browser
2. Or serve using any local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .
   ```
3. Navigate to `http://localhost:8000`
4. Register a new account or use demo credentials above
