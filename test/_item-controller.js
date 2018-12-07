const chai = require('chai');

const expect = chai.expect;
const sinon = require('sinon');

const faker = require('faker');
const makeFake = require('./helpers/make-fake');
const helper = require('./helpers/factory-helper');

const itemController = require('../api/controllers/item-controller');

// All item properties
const all = [
  'name',
  'price',
  'description',
  'images',
  'quantity',
  'ownerId',
  'createdAt',
  'updatedAt',
  '_id',
];

describe('Item Controller', () => {
  let sandbox;
  let stub;

  context('GET /items', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stub = sandbox.stub(itemController, 'read');
      stub.callsFake(makeFake('read'));
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return all items when there is no search filter', async () => {
      const result = await itemController.read();

      expect(result).to.be.an('array');
      expect(result[0]).to.include.keys(all);
    });

    it('should return all items when filter type is not a JS Object', async () => {
      const result = await itemController.read(['123']);

      expect(result).to.be.an('array');
      expect(result[0]).to.include.keys(all);
    });

    it('should return an array of relevant search items when there is one search filter', async () => {
      const filter = {
        ownerId: helper.randHex(24),
      };

      const result = await itemController.read(filter);

      expect(result).to.be.an('array');
      expect(result[0]).to.include.keys(all);
      expect(result[0].ownerId).to.equal(filter.ownerId);
    });

    it('should return an array of relevant search items when there are multiple filters', async () => {
      const filter = {
        ownerId: helper.randHex(24),
        price: 100,
      };

      const result = await itemController.read(filter);

      expect(result).to.be.an('array');
      expect(result[0]).to.include.keys(all);
      expect(result[0].ownerId).to.equal(filter.ownerId);
      expect(Number(result[0].price)).to.equal(filter.price);
    });
  });

  context('POST /items', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stub = sandbox.stub(itemController, 'create');
      stub.callsFake(makeFake('create'));
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return an object with item data when every field is filled in', async () => {
      const data = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000),
        quantity: 1 + helper.randInt(100),
        images: helper.randImages(5),
      };

      const result = await itemController.create(data);

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
    });

    it('should return an object with item data when all required fields are filled in', async () => {
      /*
       Note: for now all fields are required. Change
       this test when we add non-required fields.
       Non-required fields should be present and
       contain empty strings.
       */

      const data = {
        name: helper.generateSomeWords(2),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000),
        description: faker.lorem.lines(),
        quantity: 1 + helper.randInt(100),
      };

      const result = await itemController.create(data);

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      // add checks for non-required fields
    });

    it('should return an error message when missing required fields', async () => {
      const data = {
        name: helper.generateSomeWords(2),
      };

      const errorMessage = 'validation failed';

      const result = await itemController
        .create(data)
        .catch(error => error.message);

      expect(result).to.be.a('string');
      expect(result).to.include(errorMessage);
    });
  });

  context('PUT /items', () => {
    let updateItem;

    before(done => {
      // Generate fake item to update in the test
      updateItem = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000),
        quantity: 1 + helper.randInt(100),
        images: helper.randImages(5),
        createdAt: faker.date.past(2).toDateString(),
        updatedAt: faker.date
          .between(faker.date.past(1), new Date())
          .toDateString(),
        _id: helper.randHex(24),
      };

      done();
    });

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stub = sandbox.stub(itemController, 'update');
      stub.callsFake(makeFake('update'));
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return an error message when there is no _id ', async () => {
      const errorMessage = 'Missing ID';

      const result = await itemController
        .update()
        .catch(error => error.message);

      expect(result).to.be.a('string');
      expect(result).to.include(errorMessage);
    });

    it('should return item without changes when no update data is sent', async () => {
      const data = {
        _id: updateItem._id,
      };

      const result = await itemController.update(
        Object.assign(updateItem, data),
      );

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      expect(result._id).to.equal(data._id);
      expect(result.name).to.equal(updateItem.name);
      expect(result.description).to.equal(updateItem.description);
      expect(result.ownerId).to.equal(updateItem.ownerId);
      expect(Number(result.price)).to.equal(updateItem.price);
      expect(result.createdAt).to.equal(updateItem.createdAt);
      expect(result.updatedAt).to.equal(updateItem.updatedAt);
    });

    it('should return the updated item when there is one field to update', async () => {
      const data = {
        _id: updateItem._id,
        description: helper.generateSomeWords(15),
      };

      const result = await itemController.update(
        Object.assign(updateItem, data),
      );

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      expect(result._id).to.equal(data._id);
      expect(result.description).to.equal(data.description);
      expect(result.ownerId).to.equal(updateItem.ownerId);
      expect(Number(result.price)).to.equal(updateItem.price);
      expect(result.createdAt).to.equal(updateItem.createdAt);
    });

    it('should return the updated item when there are multiple fields to update', async () => {
      const data = {
        _id: updateItem._id,
        description: helper.generateSomeWords(15),
        price: helper.randInt(10000),
      };

      const result = await itemController.update(
        Object.assign(updateItem, data),
      );

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      expect(result._id).to.equal(data._id);
      expect(result.description).to.equal(data.description);
      expect(Number(result.price)).to.equal(data.price);
      expect(result.ownerId).to.equal(updateItem.ownerId);
      expect(result.createdAt).to.equal(updateItem.createdAt);
    });
  });

  context('DELETE /items', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stub = sandbox.stub(itemController, 'remove');
      stub.callsFake(makeFake('remove'));
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return an error message when there is no _id', async () => {
      const result = await itemController
        .remove()
        .catch(error => error.message);

      const errorMessage = 'Missing ID';

      expect(result).to.be.a('string');
      expect(result).to.include(errorMessage);
    });

    it('should return deleted item when there is a valid _id ', async () => {
      const id = helper.randHex(24);

      const data = {
        _id: id,
      };

      const result = await itemController.remove(data);

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      expect(result._id).to.equal(data._id);
    });
  });

  context('GET /items/{item}', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      stub = sandbox.stub(itemController, 'read');
      stub.callsFake(makeFake('read'));
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return an item when there is a valid ID in the path', async () => {
      const data = {
        _id: helper.randHex(24),
      };

      const result = await itemController.read(data);

      expect(result).to.be.an('object');
      expect(result).to.include.keys(all);
      expect(result._id).to.equal(data._id);
    });

    it('should return an error message when there is no valid ID in the path', async () => {
      const invalidId = 'Not an ID';

      const data = {
        _id: invalidId,
      };

      const result = await itemController
        .read(data)
        .catch(error => error.message);

      const errorMessage = 'Invalid ID';

      expect(result).to.be.a('string');
      expect(result).to.include(errorMessage);
    });
  });
});
