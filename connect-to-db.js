const mongoose = require('mongoose');
const config = require('./config');

const mongoDB = config.mongoDB.url;

async function connectToDB () {

  const DB = await mongoose.connect(mongoDB,
    { useNewUrlParser: true },
    error => {
      if (error) {
        return console.error(`Error connecting to the database: ${error}`);
      }
      console.log(`mongoDB ${config.mongoDB.type} connected`);
      return mongoose.connection;
    });
  return DB;
}

module.exports = connectToDB;
