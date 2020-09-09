const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cors());

// The jwtSecret in this example is super weak. 
// Don’t use this kind of secret in real life. Use a long, complex, unguessable secret key.
const jwtSecret = 'secret123';

app.get('/jwt', (req, res) => {
  res.json({
    token: jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret)
  });
});

app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));
const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' }
];

app.get('/foods', (req, res) => {
  res.json(foods);
});

app.listen(3001);
console.log('App running on localhost:3001');