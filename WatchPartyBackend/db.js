// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'watchParty.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the watchParty.db SQLite database.');
    createTables(db);
  }
});

function createTables(db) {
  db.run(`CREATE TABLE IF NOT EXISTS parties (
    code TEXT PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Parties table created or already exists.');
    }
  });
  // Add more tables as needed.
}

module.exports = db;