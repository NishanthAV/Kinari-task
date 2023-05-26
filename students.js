const express = require('express');
const router = express.Router();

// Create a new instance of the router with the database connection
function createRouter(connection) {
  // GET /students
  // Retrieve all students
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM students';

    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving students: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    });
  });

  // GET /students/:id
  // Retrieve a specific student by ID
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM students WHERE id = ?';

    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error retrieving student: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.json(results[0]);
      }
    });
  });

  // POST /students
  // Create a new student
  router.post('/', (req, res) => {
    const { name, totalMarks } = req.body;
    const query = 'INSERT INTO students (name, total_marks) VALUES (?, ?)';

    if (!name || !totalMarks) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    connection.query(query, [name, totalMarks], (err, results) => {
      if (err) {
        console.error('Error creating student: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const newStudent = { id: results.insertId, name, totalMarks };
      res.status(201).json(newStudent);
    });
  });

  return router;
}

module.exports = createRouter;
