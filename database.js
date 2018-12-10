const mongoose = require('mongoose');
const { mongoDB } = require('./config');

mongoose.Promise = Promise;

mongoose.connect(
  mongoDB.url,
  { useNewUrlParser: true },
  error => {
    if (error) {
      return console.error(
        `Error connecting to the database: ${error.message}`,
      );
    }
    return console.log(`mongoDB ${mongoDB.type} connected`);
  },
);

module.exports = mongoose.connection;
