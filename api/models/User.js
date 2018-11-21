/* eslint-disable func-names, space-before-function-paren */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const timestamps = require('mongoose-timestamp');

const saltRounds = 10;
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: { type: Array },
  location: { type: String },
  firstName: { type: String },
  lastName: { type: String },
});

UserSchema.plugin(timestamps);

UserSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = mongoose.model('User', UserSchema);
