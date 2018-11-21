const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

const router = require('./api/routes');

const mongoDB = config.mongoDB.url;

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true },
);

// MODELS
require('./api/models');
require('./config/passport');

const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, `client/${config.reactType}`)));
// cookieSession config
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],,
  }),
);

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

// DB
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`mongoDB ${config.mongoDB.type} connected`);
});

// ROUTES
app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/${config.reactPath}`));
});

const port = process.env.PORT || config.SERVER_PORT;

app.listen(port, () => console.log(`App listening on port ${port}!`));
