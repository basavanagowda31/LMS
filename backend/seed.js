require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  console.log('Connecting to database...');
  let connection;
  try {
    // 1. First connect without selecting a database (to create it if missing)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
    });
    
    console.log(`Connected! Creating database '${process.env.DB_NAME}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    
    // Switch to the newly created Database
    await connection.query(`USE \`${process.env.DB_NAME}\`;`);
    console.log(`Switched to database '${process.env.DB_NAME}'.`);

    // 2. Read the schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split queries by semicolon to execute them one by one
    // We ignore empty statements to prevent parsing errors
    const queries = schemaSql.split(';').filter((q) => q.trim().length > 0);

    console.log(`Found ${queries.length} queries to execute. Seeding tables and constraints...`);
    
    for (let i = 0; i < queries.length; i++) {
        const query = queries[i].trim();
        // Skip comments if isolated
        if (query.startsWith('--') && !query.includes('\n')) continue;
        
        await connection.query(query);
    }
    
    console.log('✅ Database seeded and ready successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  } finally {
    if (connection) {
       await connection.end();
    }
  }
}

seedDatabase();
