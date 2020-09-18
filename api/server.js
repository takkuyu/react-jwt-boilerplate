const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cors());
app.use(cookieParser());

// The jwtSecret in this example is super weak. 
// Don’t use this kind of secret in real life. Use a long, complex, unguessable secret key.
const jwtSecret = 'secret123';

app.get('/api/jwt', (req, res) => {
  const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);
  /* 
    The httpOnly: true setting means that the cookie can’t be read using JavaScript 
    but can still be sent back to the server in HTTP requests. 
    Without this setting, an XSS attack could use document.cookie 
    to get a list of stored cookies and their values.
  */
  res.cookie('token', token, { httpOnly: true });

  res.json({ token });
});

// looks for a JWT on the Authorization header of requests.
app.use(
  jwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
    getToken: req => req.cookies.token
  })
);

const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' }
];

app.get('/api/foods', (req, res) => {
  res.json(foods);
});

app.listen(3001);
console.log('App running on localhost:3001');