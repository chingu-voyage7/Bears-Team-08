const models = require('../models');
const helpers = require('./helpers');

const { utils } = helpers;

const { Item, User } = models;

const itemController = {

  readOne: async function readOne (req, res) {

    const id = utils.formatId(req.params.item);

    if (!id) {
      const errorMessage = 'Invalid ID';
      res.status(400);
      console.error('Error (400):', errorMessage);
      return res.send(errorMessage);
    }

    const query = Item.findById(id);

    return query.exec()
      .then(result => {
        if (!result) {
          res.status(400);
          return res.send('Item not found.');
        }
        return res.json(result)
      })
      .catch(error => {
        console.error(`Server error:\n${error.message}`);
        res.status(500);
        return res.send('Server error.')
      });

  },

  read: async function read (req, res) {

    const data = req.query;

    const queryParams = utils.getFormData(data);

    const query = Item.find(queryParams);

    return query.exec()
      .then(result => {
        if (!result) {
          res.status(400);
          return res.send('Not found.');
        }
        return res.json(result)
      })
      .catch(error => {
        console.error(`Server error:\n${error.message}`);
        res.status(500);
        return res.send('Server error.')
      });

  },

  create: async function create (req, res) {

    const ownerId = req.isAuthenticated() ? req.user._id.toString() : '';

    const itemParams = utils.getFormData(req.body);
    itemParams.ownerId = ownerId;

    const user = await User.findById(req.user._id).exec();

    const item = new Item(itemParams);

    return item.save()
      .then(result => {
        // Add item to user
        



        return res.json(result);
      })
      .catch(error => {
        const errorMessage = 'validation failed';
        if (error.message.includes(errorMessage)) {
          res.status(400);
          console.error('Error (400):', error.message);
          return res.send(error.message);
        } else {
          console.error(`Error saving to database:\n${error.message}`);
          res.status(500);
          return res.send('Server error.');
        }
      });

  },

  update: async function update (req, res) {

    // check if ownerId equals session id

    const data = req.body;

    const id = utils.getId(data);

    if (id === null) {
      const errorMessage = 'Missing ID';
      res.status(400);
      console.error('Error (400):', errorMessage);
      return res.send(errorMessage);
    }

    const itemParams = utils.getFormData(data);
    const options = { new: true };
    const query = Item.findByIdAndUpdate(id, itemParams, options);

    return query.exec()
      .then(result => {
        console.log("\nUpdated item:\n", result, "\n");
        return res.json(result);
      })
      .catch(error => {
        console.error(`Error saving to database:\n${error.message}`);
        res.status(500);
        return res.send('Server error.');
      });

  },

  remove: async function remove (req, res) {

    const data = req.body;

    const id = utils.getId(data);

    if (id === null) {
      const errorMessage = 'Missing ID';
      res.status(400);
      console.error('Error (400):', errorMessage);
      return res.send(errorMessage);
    }

    const query = Item.findByIdAndRemove(id);

    return query.exec()
      .then(result => {
        console.log("\nDeleted item:\n", result, "\n")
        res.locals._id = result._id.toString();
        return res.send(`deleted ${res.locals._id}`);
      })
      .catch(error => {
        res.status(500);
        res.locals._id = id.toString();
        console.error(`Error when deleting database entry:\n${error.message}`);
        return res.send(`Server error: could not delete ${res.locals._id}`);
      });

  }

};

module.exports = itemController;
