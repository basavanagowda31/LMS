require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 11125,
    database: process.env.DB_NAME || 'lms_db'
  });

  try {
    await connection.query('DELETE FROM videos');
    await connection.query('ALTER TABLE videos AUTO_INCREMENT = 1');

    const videosToAdd = [
      // Subject 1: Fullstack Web Development
      // Section 1: Introduction (id: 1)
      { s: 1, title: 'What is Web Development?', desc: 'A quick overview of what Web Development is.', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', idx: 1, duration: 300 },
      { s: 1, title: 'HTML & CSS Crash Course', desc: 'Get up and running with HTML and CSS fast.', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', idx: 2, duration: 600 },
      
      // Section 2: Frontend Development (id: 2)
      { s: 2, title: 'React JS Crash Course', desc: 'Master the basics of React JS.', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', idx: 1, duration: 5000 },
      { s: 2, title: 'Tailwind CSS in 20 Mins', desc: 'Learn Tailwind CSS practically.', url: 'https://www.youtube.com/watch?v=UBOj6rqRUME', idx: 2, duration: 1200 },
      
      // Section 3: Backend Development (id: 3)
      { s: 3, title: 'Node.js Basics', desc: 'Introduction to Node and Express.', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', idx: 1, duration: 3600 },
      { s: 3, title: 'Learn SQL in 60 Mins', desc: 'Database essentials for developers.', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', idx: 2, duration: 3600 }
    ];

    for (let vid of videosToAdd) {
      await connection.query(`
        INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [vid.s, vid.title, vid.desc, vid.url, vid.idx, vid.duration]);
    }
    console.log('Real reliable teaching videos inserted successfully.');
  } catch(e) {
    console.error(e);
  } finally {
    await connection.end();
  }
}
fix();
