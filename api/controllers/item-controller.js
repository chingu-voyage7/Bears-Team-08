const models = require('../models');
const helpers = require('./helpers');

const { utils } = helpers;

const { Item, User } = models;

const itemController = {
  readOne: async function readOne(req, res) {
    const id = utils.formatId(req.params.item);

    if (!id) {
      const errorMessage = 'Invalid ID';
      res.status(400);
      return res.send(errorMessage);
    }

    const query = Item.findById(id);

    return query
      .exec()
      .then(result => {
        if (!result) {
          res.status(400);
          return res.send('Item not found.');
        }
        return res.json(result);
      })
      .catch(error => {
        console.error('Server error:', error.message);
        res.status(500);
        return res.send('Server error.');
      });
  },

  read: async function read(req, res) {
    const data = req.query;

    const queryParams = utils.getFormData(data);

    const query = Item.find(queryParams);

    return query
      .exec()
      .then(result => {
        if (!result) {
          res.status(400);
          return res.send('Not found.');
        }
        return res.json(result);
      })
      .catch(error => {
        console.error('Server error:', error.message);
        res.status(500);
        return res.send('Server error.');
      });
  },

  create: async function create(req, res) {
    const ownerId = req.isAuthenticated() ? req.user._id.toString() : '';

    const itemParams = utils.getFormData(req.body);
    itemParams.ownerId = ownerId;

    let user;

    try {
      user = await User.findById(req.user._id).exec();
    } catch (error) {
      res.status(400);
      return res.send(error.message);
    }

    const item = new Item(itemParams);

    return item
      .save()
      .then(async result => {
        // Add item to user
        try {
          user.products.push(result._id);
          await user.save();
        } catch (error) {
          res.status(500);
          return res.send('Server error.');
        }
        return res.json(result);
      })
      .catch(error => {
        const errorMessage = 'validation failed';
        if (error.message.includes(errorMessage)) {
          res.status(400);
          return res.send(error.message);
        }
        res.status(500);
        return res.send('Server error.');
      });
  },

  update: async function update(req, res) {
    const data = req.body;

    const id = utils.getId(data);

    if (id === null) {
      const errorMessage = 'Missing ID';
      res.status(400);
      return res.send(errorMessage);
    }

    // Check if item belongs to authenticated user
    let item;

    try {
      item = await Item.findById(id);
    } catch (error) {
      res.status(500);
      return res.send('Server error.');
    }

    if (item.ownerId !== req.user._id.toString()) {
      res.status(500);
      return res.send('Server error.');
    }

    const itemParams = utils.getFormData(data);
    const options = { new: true };
    const query = Item.findByIdAndUpdate(id, itemParams, options);

    return query
      .exec()
      .then(result => res.json(result))
      .catch(error => {
        console.error('Server error:', error.message);
        res.status(500);
        return res.send('Server error.');
      });
  },

  remove: async function remove(req, res) {
    const data = req.body;

    const id = utils.getId(data);

    if (id === null) {
      const errorMessage = 'Missing ID';
      res.status(400);
      return res.send(errorMessage);
    }

    // Check if item belongs to authenticated user
    let item;

    try {
      item = await Item.findById(id);
    } catch (error) {
      res.status(500);
      return res.send('Server error.');
    }

    if (item.ownerId !== req.user._id.toString()) {
      res.status(500);
      return res.send('Server error.');
    }

    // Get the user from DB
    let user;

    try {
      user = await User.findById(req.user._id).exec();
    } catch (error) {
      res.status(400);
      return res.send(error.message);
    }

    const query = Item.findByIdAndRemove(id);

    return query
      .exec()
      .then(async result => {
        // Remove from user's items list
        const itemList = user.products;

        const itemIndex = itemList.findIndex(
          item => item.toString() === id.toString(),
        );

        itemList.splice(itemIndex, 1);

        try {
          await user.save();
        } catch (error) {
          res.status(500);
          return res.send('Server error.');
        }

        res.locals._id = result._id.toString();
        return res.send(`deleted ${res.locals._id}`);
      })
      .catch(error => {
        console.error('Server error:', error.message);
        res.status(500);
        res.locals._id = id.toString();
        return res.send(`Server error: could not delete ${res.locals._id}`);
      });
  },
};

module.exports = itemController;
