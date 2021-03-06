const mongoose = require('mongoose');

const options = {
  timestamps: true,
  versionKey: false
}

const itemSchema = mongoose.Schema({
  name: { type: String, required: true },
  ownerId: {type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
}, options);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
