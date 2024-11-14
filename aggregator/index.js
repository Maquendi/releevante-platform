import { db } from "./db.js";

db.all("SELECT * FROM user", (err, rows) => {
  if (err) {
    console.error('Error executing query:', err.message);
  } else {
    console.log('Data from table:', rows);
  }
});


db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
