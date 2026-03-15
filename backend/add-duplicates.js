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
    const defaultVids = [
      { s: 1, t: 'Duplicate Basics', du: 600 },
      { s: 2, t: 'Duplicate Advanced', du: 700 },
      { s: 3, t: 'Duplicate Masterclass', du: 800 },
      { s: 4, t: 'Duplicate Containerization', du: 600 },
      { s: 5, t: 'Duplicate Deep Dive', du: 700 },
      { s: 6, t: 'Duplicate Architecture', du: 800 }
    ];

    for (let vid of defaultVids) {
      await connection.query(`
        INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) 
        VALUES (?, ?, 'A duplicate video added for testing purposes.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 4, ?)
      `, [vid.s, vid.t, vid.du]);
    }
    console.log('Duplicate videos added successfully to all sections.');
  } catch(e) {
    if (e.code !== 'ER_DUP_ENTRY') console.error(e);
  } finally {
    await connection.end();
  }
}
fix();
