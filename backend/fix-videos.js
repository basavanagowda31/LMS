require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME
  });

  try {
    await connection.query(`
      INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) 
      SELECT id, 'Welcome to the Module', 'Here is your first lesson. Let us dive in.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 600
      FROM sections WHERE subject_id > 1;
    `);
    console.log('Videos added to empty sections!');
  } catch(e) {
    if (e.code !== 'ER_DUP_ENTRY') console.error(e);
  } finally {
    await connection.end();
  }
}
fix();
