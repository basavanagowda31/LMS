require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function addDummyData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME
  });

  try {
    await connection.query(`
      INSERT INTO subjects (title, slug, description, is_published) 
      VALUES 
      ('Advanced React Patterns', 'adv-react', 'Master React context, custom hooks, and suspense.', true),
      ('Docker Deployment Masterclass', 'docker-master', 'Containerize your apps like a pro.', true),
      ('Python for AI', 'python-ai', 'Build AI models using Python and PyTorch.', true)
      ON DUPLICATE KEY UPDATE title=title;
    `);

    // Insert dummy sections for advanced react
    const [reactSubject] = await connection.query(`SELECT id FROM subjects WHERE slug='adv-react'`);
    if(reactSubject.length > 0) {
       const subId = reactSubject[0].id;
       await connection.query(`INSERT INTO sections (subject_id, title, order_index) VALUES (${subId}, 'Fundamentals', 1), (${subId}, 'Data Fetching', 2)`);
    }

    // Insert dummy sections for docker
    const [dockerSubject] = await connection.query(`SELECT id FROM subjects WHERE slug='docker-master'`);
    if(dockerSubject.length > 0) {
       const subId = dockerSubject[0].id;
       await connection.query(`INSERT INTO sections (subject_id, title, order_index) VALUES (${subId}, 'Docker Basics', 1)`);
    }

    console.log('Dummy courses inserted!');
  } catch(e) {
    console.error(e);
  } finally {
    await connection.end();
  }
}
addDummyData();
