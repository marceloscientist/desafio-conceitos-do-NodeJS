const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());


const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(404).json({ message: "User not found" });
  }
  request.user = user;
  return next();
} //ok

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const usernameExists = users.some(user => user.username === username);
  if (usernameExists) {
    return response.status(400).json({ error: "Username already Exists" });
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  users.push(user);
  return response.status(201).json(user);
}); // ok

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos)
}); // ok

app.get('/users', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user);
}); // ok

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline + " 00:00"),
    createdAt: new Date()
  }
  user.todos.push(todo);
  console.log(user.todos);
  return response.status(201).send();
}); // ok

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.headers;
  const { user } = request;
  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(400).json("Todo not found!");
  }
  todo.title = title;
  todo.deadline = new Date(deadline + " 00:00");
  console.log(`title: ${todo.title} deadline: ${todo.deadline}`);
  return response.status(204).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.headers;
  const { user } = request;
  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(400).json("Todo not found!");
  }
  todo.done = true;
  console.log(`Done: ${todo.done}`);
  return response.status(204).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.headers;
  const { user } = request;
  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(400).json("Todo not found!");
  }
  user.todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;