const mongoose = require('mongoose');
const { mongoDB } = require('./config');

mongoose.connect(
  mongoDB.url,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

module.exports = db;

