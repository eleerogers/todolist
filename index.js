require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const generatePassword = require('password-generator');
const { getDate, getDay } = require('./getDate');

const app = express();
app.use(bodyParser.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const todoSchema = new mongoose.Schema({
  todo: String,
  completed: String,
  list: String
}) 

const Todo = mongoose.model("Todo", todoSchema);


// const defaultItems = [groceries, washFish, annoyBoo]; 

// Todo.insertMany(defaultItems, (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("successfully inserted default items")
//   }
// });

// let items = [];

app.get('/api/day', (req, res) => {
  const currentDay = getDate();
  res.send(currentDay);
})

app.post('/api/todo', (req, res) => {
  const {todo, list, completed} = req.body;
  const newTodo = new Todo({ todo, list, completed })
  newTodo.save((err, todo) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`succesfully added ${todo.todo}`);
    }
    res.redirect('/api/todo');
  })
})

app.put('/api/todo', (req, res) => {
  console.log("req.body put", req.body);
})

app.post('/api/deleteTodo', (req, res) => {
  const { _id } = req.body;
  Todo.deleteOne({ _id }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("successfully deleted item")
    }
    res.redirect('/api/todo')
  })
})

app.get('/api/todo', (req, res) => {
  Todo.find({}, (err, results) => {
    res.send(results)
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