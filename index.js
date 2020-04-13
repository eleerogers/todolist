require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const generatePassword = require('password-generator');
const { getDate, getDay } = require('./getDate');

const app = express();
app.use(bodyParser.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const connectionString = process.env.SQL_CONNECTION_STRING;

const pool = new Pool({
  connectionString
});


app.get('/api/day', (req, res) => {
  const currentDay = getDate();
  res.send(currentDay);
})

app.post('/api/todo', (req, res) => {
  const {todo, list, completed} = req.body;
  pool.query('INSERT INTO todos (todo, list, completed) VALUES ($1, $2, $3) RETURNING *', [todo, list, completed], (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    res.redirect('/api/todo');
  })
  
})

app.put('/api/todo', (req, res) => {
  const { _id, completed } = req.body;
  pool.query(
    'UPDATE todos SET completed = $1 WHERE _id = $2',
    [completed, _id],
    (error, results) => {
      if (error) {
        console.error(error);
        throw error;
      }
      res.redirect(303, '/api/todo');
    }
  );
})

app.post('/api/deleteTodo', (req, res) => {
  const _id = parseInt(req.body._id, 10);
  pool.query('DELETE FROM todos WHERE _id = $1', [_id], (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
    res.redirect('/api/todo');
  });
  
})

app.get('/api/todo', (req, res) => {
  pool.query('SELECT * FROM todos', (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).send();
      return;
    }
    res.status(200).json(results.rows);
  })
})

// Put all API endpoints under '/api'
app.get('/api/passwords', (req, res) => {
  const count = 5;

  // Generate some passwords
  const passwords = Array.from(Array(count).keys()).map(i =>
    generatePassword(12, false)
  )

  // Return them as json
  res.json(passwords);

});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Todo App listening on ${port}`);