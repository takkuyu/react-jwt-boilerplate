const express = require('express');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express();
const csrf = require('csurf')

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
  res.cookie('token', { accessToken: token }, { httpOnly: true });

  res.json({ token });
});

// looks for a JWT on the Authorization header of requests 
// for requests after this function. So "/api/jwt" does not use this.
app.use(
  jwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
    getToken: req =>{
      console.log(req.cookies)
    return req.cookies.token.accessToken}
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

// ** Adding CSRF Protection **
const csrfProtection = csrf({
  cookie: true
});

app.use(csrfProtection);

// We’ll want an endpoint that accepts GET requests and sends back a new anti-CSRF token.
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// A POST request to create a new food item will result in a 403 Forbidden error 
// when on the server we are requiring that a anti-CSRF token be present in the request, but we are not providing one.
app.post('/api/foods', (req, res) => {
  foods.push({
    id: foods.length + 1,
    description: 'new food'
  });
  res.json({
    message: 'Food created!'
  });
});

app.listen(3001);
console.log('App running on localhost:3001');