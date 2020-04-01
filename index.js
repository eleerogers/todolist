require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const generatePassword = require('password-generator');
const { getDate, getDay } = require('./getDate');

const app = express();
app.use(bodyParser.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

let items = [];

app.get('/api/day', (req, res) => {
  const currentDay = getDate();
  res.send(currentDay);
})

app.post('/api/todo', (req, res) => {
  const {todo, list} = req.body;
  items.push({todo, list});
  res.send(items);
})

app.get('/api/todo', (req, res) => {
  items = [];
  res.sendStatus(200);
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