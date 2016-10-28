const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
const path = require('path');
const login = require('./routes/login');
const register = require('./routes/register');
const auth = require('./auth/setup');
const passport = require('passport');
const session = require('express-session');

const sessionConfig = {
  secret: 'This is a secret key, but a really bad idea to put directly in code',
  key: 'user',
  resave: true,
  saveUninitialized: true,
  cookie: {
      maxAge: 30 * 60 * 1000,
      secure: false
  }
};

connection.connect();
auth.setup();

const app = express();

app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', login);
app.use('/register', register);

//  Everything beyond here must be authenticated

app.use(ensureAuthenticated);

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated) {
    next();
  } else {
    res.sendStatus(401);
  }
}

var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port);
});
