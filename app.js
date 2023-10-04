const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');


// Middleware

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeDB',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Define CRUD routes here

// Serve the HTML form for adding a new record
app.get('/add', (req, res) => {
  res.render('add_record');
});

// Add this route handler to serve the edit form for a specific record
app.get('/api/edit/:id', (req, res) => {
  const userId = req.params.id;

  // Fetch the user record from the database based on the user ID
  const selectQuery = 'SELECT * FROM users WHERE id = ?';

  db.query(selectQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ user: results[0] });
      }
    }
  });
});



// Create a new record
app.post('/create', (req, res) => {
  const { name, email } = req.body;

  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.query(insertQuery, [name, email], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to add a new record' });
    } else {
      console.log('New record added:', result);
     
      res.status(201).json({ message: 'New record added successfully' });
    }
  });
});

// Serve the HTML form for editing a record
app.get('/edit/:id', (req, res) => {
  const userId = req.params.id;

  // Fetch the user record from the database based on the user ID
  const selectQuery = 'SELECT * FROM users WHERE id = ?';

  db.query(selectQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Render the edit form with the user's data
        res.render('edit_record', { user: results[0] });
      }
    }
  });
});

// Update an existing record
app.post('/update', (req, res) => {
  const { id, name, email } = req.body;

  // Update the user record in the database
  const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

  db.query(updateQuery, [name, email, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'Failed to update the record' });
    } else {
      console.log('Record updated:', result);

      // Redirect to a page or send a response as needed
      res.redirect('/'); // Redirect to the list of records page
    }
  });
});

// Add this route handler to display the list of records
app.get('/', (req, res) => {
  // Replace this with your database query to fetch records from the 'users' table
  const selectQuery = 'SELECT * FROM users';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      // Render the EJS view with the list of records
      res.render('record_list', { records: results });
    }
  });
});
// Add this route handler to delete a record
app.get('/delete/:id', (req, res) => {
    const userId = req.params.id;

    // Delete the user record from the database based on the user ID
    const deleteQuery = 'DELETE FROM users WHERE id = ?';

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ error: 'Failed to delete the record' });
        } else {
            console.log('Record deleted:', result);

            // Redirect to the list of records page after deletion
            res.redirect('/'); // Redirect to the list page
        }
    });
});
// API
// Create a new record (API)
app.post('/api/create', (req, res) => {
  const { name, email } = req.body;

  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.query(insertQuery, [name, email], (err, result) => {
      if (err) {
          console.error('Error inserting data:', err);
          res.status(500).json({ error: 'Failed to add a new record' });
      } else {
          console.log('New record added:', result);
          res.status(201).json({ message: 'New record added successfully' });
      }
  });
});

// Read all records (API)
app.get('/api/records', (req, res) => {
  // Replace this with your database query to fetch records from the 'users' table
  const selectQuery = 'SELECT * FROM users';

  db.query(selectQuery, (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          res.status(500).json({ error: 'Failed to fetch data' });
      } else {
          res.status(200).json({ records: results });
      }
  });
});

// Read a single record by ID (API)
app.get('/api/records/:id', (req, res) => {
  const userId = req.params.id;

  // Fetch the user record from the database based on the user ID
  const selectQuery = 'SELECT * FROM users WHERE id = ?';

  db.query(selectQuery, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching data:', err);
          res.status(500).json({ error: 'Failed to fetch data' });
      } else {
          if (results.length === 0) {
              res.status(404).json({ error: 'User not found' });
          } else {
              res.status(200).json({ user: results[0] });
          }
      }
  });
});

// Update an existing record (API)
app.put('/api/update/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  // Update the user record in the database
  const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

  db.query(updateQuery, [name, email, userId], (err, result) => {
      if (err) {
          console.error('Error updating data:', err);
          res.status(500).json({ error: 'Failed to update the record' });
      } else {
          console.log('Record updated:', result);
          res.status(200).json({ message: 'Record updated successfully' });
      }
  });
});

// Delete a record (API)
app.delete('/api/delete/:id', (req, res) => {
  const userId = req.params.id;

  // Delete the user record from the database based on the user ID
  const deleteQuery = 'DELETE FROM users WHERE id = ?';

  db.query(deleteQuery, [userId], (err, result) => {
      if (err) {
          console.error('Error deleting data:', err);
          res.status(500).json({ error: 'Failed to delete the record' });
      } else {
          console.log('Record deleted:', result);
          res.status(200).json({ message: 'Record deleted successfully' });
      }
  });
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
