const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./api/routes');

const mongoDB = config.mongoDB.url;

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true },
);
const app = express();

// DB
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`mongoDB ${config.mongoDB.type} connected`);
});

// ROUTES
app.use('/index', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// MISC
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'client/build')));

const port = process.env.PORT || config.SERVER_PORT;

app.listen(port, () => console.log(`App listening on port ${port}!`));
