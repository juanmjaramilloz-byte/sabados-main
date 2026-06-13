const mysql = require('mysql2/promise');
const fs = require('fs');

async function initDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            multipleStatements: true
        });

        const sql = fs.readFileSync(__dirname + '/database.sql', 'utf8');
        await connection.query(sql);
        console.log('Database initialized successfully.');
        await connection.end();
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDb();
