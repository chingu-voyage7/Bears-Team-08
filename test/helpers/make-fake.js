
const objectFactory = require('./object-factory');
const utils = require('../../api/controllers/helpers/utils');

function makeFake (action) {

  switch (action.toLowerCase()) {

    case 'read':
      return function fakeRead (data) {

        let id = utils.getId(data);

        if (utils.checkProperty(data, '_id') && !id) {
          return Promise.reject(new Error('Invalid ID'));
        }

        let config =  id ? { _id: id.toString() } : utils.getFormData(data);

        let factoryConfig = {
          n: id ? 0 : 11,
          filter: config
        };

        return objectFactory(factoryConfig);

      };

      break;

    case 'create':
      return function fakeCreate (data) {

        // Insert required property names here
        let required = [
          'name',
          'price',
          'description',
          'ownerId'
        ];

        // Insert non-required property names here
        let nonRequired = [];

        let config = utils.getFormData(data);

        // Error if missing required fields
        for (let field of required) {
          if (!utils.checkProperty(config, field)) {
            let msg = 'validation failed';
            return Promise.reject(new Error(msg));
          }
        }

        // Create non-required fields as empty strings if not present
        for (let field of nonRequired) {
          if (!utils.checkProperty(config, field)) {
            config[field] = '';
          }
        }

        let factoryConfig = {
          n: 0,
          filter: config
        };

        return objectFactory(factoryConfig);

      };

      break;

    case 'update':
      return function fakeUpdate (data) {

        let _id = utils.getId(data);

        if (_id === null) {
          return Promise.reject(new Error('Missing ID'));
        }

        let id = {
          _id: _id.toString()
        };

        let config = Object.assign( id, utils.getFormData(data) );

        let factoryConfig = {
          n: 0,
          filter: config
        };
        return objectFactory(factoryConfig);
      };
      break;

    case 'remove':
      return function fakeRemove (data) {

        let _id = utils.getId(data);

        if (_id === null) {
          return Promise.reject(new Error('Missing ID'));
        }

        let id = {
          _id: _id.toString()
        };

        let config = Object.assign(id, utils.getFormData(data));

        let factoryConfig = {
          n: 0,
          filter: config
        };
        return objectFactory(factoryConfig);
      };
      break;

    default:
      return function fake (data) {
        return Promise.reject(new Error('THIS IS FAKE!'));
      };
  }

}

module.exports = makeFake;
