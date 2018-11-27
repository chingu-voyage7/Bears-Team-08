const mongoose = require('mongoose');
const { mongoDB } = require('./config');

mongoose.connect(
  mongoDB.url,
  { useNewUrlParser: true },
  error => {
    if (error) {
      return console.error(
        `Error connecting to the database: ${error.message}`,
      );
    }
    console.log(`mongoDB ${mongoDB.type} connected`);
  },
);

module.exports = mongoose.connection;
