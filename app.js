const express = require('express');
const dotenv = require('dotenv');
const studentsRouter = require('./students');
const mysql = require('mysql');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to the database');
});

// Pass the database connection to the students router
app.use('/students', studentsRouter(connection));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
