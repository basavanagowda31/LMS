require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function populate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 11125,
    database: process.env.DB_NAME || 'lms_db'
  });

  try {
    // 1. Ensure sections for all subjects exist
    // Subjects were: 1: Fullstack, 2: Adv React, 3: Docker, 4: Python AI
    
    // Subject 3: Docker (ensure enough sections)
    const [s3_sec] = await connection.query('SELECT id FROM sections WHERE subject_id = 3');
    if (s3_sec.length <= 1) { // checking if it needs more
      await connection.query("INSERT INTO sections (subject_id, title, order_index) VALUES (3, 'Docker Fundamentals', 1)");
      await connection.query("INSERT INTO sections (subject_id, title, order_index) VALUES (3, 'Advanced Docker', 2)");
    }

    // Subject 4: Python for AI
    const [s4_sec] = await connection.query('SELECT id FROM sections WHERE subject_id = 4');
    if (s4_sec.length === 0) {
      await connection.query("INSERT INTO sections (subject_id, title, order_index) VALUES (4, 'Python Basics', 1)");
      await connection.query("INSERT INTO sections (subject_id, title, order_index) VALUES (4, 'AI & Machine Learning', 2)");
    }

    // Get all sections again
    const [sections] = await connection.query('SELECT * FROM sections');
    console.log('Current sections:', sections.length);

    // 2. Clear existing videos to avoid mess
    await connection.query('DELETE FROM videos');
    await connection.query('ALTER TABLE videos AUTO_INCREMENT = 1');

    const videos = [];
    
    // Web Dev (Subject 1)
    // Section 1: Intro
    videos.push([1, 'Web Dev Overview', 'Start here', 'https://www.youtube.com/watch?v=kjtGTC9Bq9Y', 1, 300]);
    videos.push([1, 'HTML Basics', 'Structure', 'https://www.youtube.com/watch?v=qz0aGYrrlhU', 2, 600]);
    // Section 2: Frontend
    videos.push([2, 'CSS Layouts', 'Design', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 1, 1200]);
    videos.push([2, 'React Tutorial', 'Framework', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 2, 5000]);
    // Section 3: Backend
    videos.push([3, 'Node and Express', 'Server', 'https://www.youtube.com/watch?v=Oe421EPjeBE', 1, 3600]);
    videos.push([3, 'Database Schema', 'Storage', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 2, 3600]);

    // Adv React (Subject 2)
    const s2_1 = sections.find(s => s.subject_id === 2 && s.order_index === 1)?.id;
    const s2_2 = sections.find(s => s.subject_id === 2 && s.order_index === 2)?.id;
    if (s2_1) {
        videos.push([s2_1, 'Advanced Hooks', 'UseCallback, UseMemo', 'https://www.youtube.com/watch?v=TNhaISOUy6Q', 1, 2500]);
    }
    if (s2_2) {
        videos.push([s2_2, 'React Context API', 'State management', 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', 1, 1800]);
    }

    // Docker (Subject 3)
    const s3_1 = sections.find(s => s.subject_id === 3 && s.order_index === 1)?.id;
    const s3_2 = sections.find(s => s.subject_id === 3 && s.order_index === 2)?.id;
    if (s3_1) {
        videos.push([s3_1, 'What is Docker?', 'Getting started', 'https://www.youtube.com/watch?v=3c-iBn7E97M', 1, 2000]);
    }
    if (s3_2) {
        videos.push([s3_2, 'Docker Compose', 'Multi-container', 'https://www.youtube.com/watch?v=HG6yIjBerSA', 1, 1500]);
    }

    // Python AI (Subject 4)
    const s4_1 = sections.find(s => s.subject_id === 4 && s.order_index === 1)?.id;
    const s4_2 = sections.find(s => s.subject_id === 4 && s.order_index === 2)?.id;
    if (s4_1) {
        videos.push([s4_1, 'Python for Beginners', 'Syntax', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 1, 3600]);
    }
    if (s4_2) {
        videos.push([s4_2, 'AI with Python', 'Introduction', 'https://www.youtube.com/watch?v=mkv5mxnvW_U', 1, 4000]);
    }

    for (const v of videos) {
      await connection.query('INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, ?, ?)', v);
    }

    console.log('Videos populated for all courses.');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
populate();
