const express = require('express');
const Item = require('../models/item');
const itemController = require('../controllers/item-controller');

const itemRouter = express.Router();

// Items
// To do: Link to authorization system
// To do: sanitize database input

itemRouter.get('/items/:item', (req, res, next) => {

  let data = { _id: req.params.item };

  itemController.read(data)
    .then(result => {
      if (!result) {
        res.status(400);
        return res.send('Item not found.');
      }
      return res.json(result)
    })
    .catch(error => {
      let message = 'Invalid ID';
      if (error.message.includes(message)) {
        res.status(400);
        console.error('Error (400):', error.message);
        return res.send(error.message);
      } else {
        console.error(`Server error:\n${error.message}`);
        res.status(500);
        return res.send('Server error.');
      }
    });

});

itemRouter.route('/items')

  .get((req, res, next) => {

    let data = req.query;

    itemController.read(data)
      .then(result => {
        return res.json(result)
      })
      .catch(error => {
        res.status(500);
        return res.send('Server error.');
      });

  })

  .post((req, res, next) => {

    let data = req.body;

    itemController.create(data)
      .then(result => {
        return res.json(result);
      })
      .catch(error => {
        let message = 'validation failed';
        if (error.message.includes(message)) {
          res.status(400);
          console.error('Error (400): ', error.message);
          return res.send(error.message);
        } else {
          console.error(`Error saving to database: ${error.message}`);
          res.status(500);
          return res.send('Server error.');
        }
      });


  })

  .put((req, res, next) => {

    let data = req.body;

    itemController.update(data)
      // What shall we return?
      .then(result => {
        console.log("\nUpdated item:\n", result, "\n");
        return res.send('successfully updated');
      })
      .catch(error => {
        let message = 'Missing ID';
        if (error.message.includes(message)) {
          res.status(400);
          console.error('Error (400): ', error.message);
          return res.send(error.message);
        } else {
          console.error(`Error saving to database: ${error.message}`);
          res.status(500);
          return res.send('Server error.');
        }
      });

  })

  .delete((req, res, next) => {

    let data = req.body;

    itemController.remove(data)
      .then(result => {
        console.log("\nDeleted item:\n", result, "\n")
        res.locals._id = result._id.toString();
        return res.send(`deleted ${res.locals._id}`);
      })
      .catch(error => {
        let message = 'Missing ID';
        if (error.message.includes(message)) {
          res.status(400);
          console.error('Error (400):', error.message);
          return res.send(error.message);
        } else {
          res.status(500);
          res.locals._id = error._id;
          console.error(`Error when deleting database entry: ${error.message}`);
          return res.send(`Server error: could not delete ${res.locals._id}`);
        }
      });

  });


module.exports = itemRouter;
