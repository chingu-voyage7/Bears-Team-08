const Item = require('../models/item');
const utils = require('./helpers/utils');

const itemController = {

  read: function read (data) {

    let id = utils.getId(data);

    if (utils.checkProperty(data, '_id') && !id) {
      return Promise.reject(new Error('Invalid ID'));
    }

    let queryParams = utils.getFormData(data);

    let query = id ? Item.findById(id) : Item.find(queryParams);

    return query.exec()
      .catch(error => {
        throw error;
      });

  },

  create: function create (data) {

    let itemParams = utils.getFormData(data);
    let item = new Item(itemParams);

    return item.save()
      .catch(error => {
        throw error;
      });

  },

  update: function update (data) {

    let id = utils.getId(data);

    if (id === null) {
      return Promise.reject(new Error('Missing ID'));
    }

    let itemParams = utils.getFormData(data);
    let options = { new: true };
    let query = Item.findByIdAndUpdate(id, itemParams, options);

    return query.exec()
      .catch(error => {
        throw error;
      });

  },

  remove: function remove (data) {

    let id = utils.getId(data);

    if (id === null) {
      return Promise.reject(new Error('Missing ID'));
    }

    let query = Item.findByIdAndRemove(id);

    return query.exec()
      .catch(error => {
        error._id = id.toString();
        throw error;
      });

  }

};

module.exports = itemController;
