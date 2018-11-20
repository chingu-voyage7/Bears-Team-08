const express = require('express');
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
app.use('/', router);

// MISC
app.use(cors());

const port = config.SERVER_PORT || 8080;

app.listen(port, () => console.log(`App listening on port ${port}!`));
