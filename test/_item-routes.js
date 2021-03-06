require('dotenv').load();
const path = require('path');
const mock = require('mock-require');
const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;
chai.use(chaiHttp);

const helper = require('./helpers/factory-helper');
const faker = require('faker');

const apiPath = '/api';

// Set variable MOCK=true in .env or shell to mock dependencies:
if (process.env.MOCK_DEPENDENCIES) {
  console.log("\nMocking Database and Item Controller\n");
  /*
  Usage:
  mock(path_to_real, path_to_fake):
  both paths are relative to the current file
   */
  mock('../database', () => {});
  mock('../api/controllers/item-controller', './helpers/fake-item-controller');

  // to stop mocking : mock.stopAll();
}

// Note: need to pass --exit flag to mocha in package.json scripts.test to close the server after tests
const server = require('../index');

// All item properties
let all = [
  'name',
  'price',
  'description',
  'ownerId',
  'createdAt',
  'updatedAt',
  '_id'
];

describe('Item routes', function() {

  context('POST request to /items', function() {

    it('should return an object with item data when every field is filled in',
    function(done) {

      let data = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(),
        price: helper.randInt(10000)
      };

     chai.request(server)
      .post(path.join(apiPath, 'items'))
      .send(data)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.body).to.have.all.keys(all);
        expect(res.body.name).to.equal(data.name);
        expect(res.body.description).to.equal(data.description);
        expect(res.body.ownerId).to.equal(data.ownerId);
        expect(Number(res.body.price)).to.equal(data.price);
        done();
      });

    });

    it('should return a 400 error when missing required fields',
    function(done) {

      let data = {
        name: helper.generateSomeWords(2)
      }

      let errorMessage = 'validation failed';

      chai.request(server)
        .post(path.join(apiPath, 'items'))
        .send(data)
        .end(function(err, res){
          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);
          done();
       });

    });

  });

  context('PUT request to /items', function() {

    let updateItem;

    // Save a random item to the database to update it in the test
    before(function (done) {

      let data = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000)
      };

     chai.request(server)
      .post(path.join(apiPath, 'items'))
      .send(data)
      .end(function(err, res){
        updateItem = res.body;
        console.log(`\nThis item will be updated by the test:\n`, updateItem, "\n");
        done();
      });

    });


    it('should return a 400 error when there is no request body',
    function (done) {

      let errorMessage = 'Missing ID'

      chai.request(server)
        .put(path.join(apiPath, 'items'))
        .end(function(err, res){
          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);
          done();
       });

    });

    it('should return updated item when there is one field to update',
    function(done) {

      let data = {
        _id: updateItem._id,
        name: 'Updated Name!'
      };

      chai.request(server)
       .put(path.join(apiPath, 'items'))
       .send(Object.assign(updateItem, data))
       .end(function(err, res){
         expect(res.status).to.equal(200);
         // expect(res.body).to.include.all.keys(all);
         // expect(res.body._id).to.equal(data._id);
         // expect(res.body.name).to.equal(data.name);
         expect(res.text).to.include('successfully updated');
         done();
       });

    });

    it('should return updated item when there are multiple fields to update',
    function(done) {

      let data = {
        _id: updateItem._id,
        description: 'Updated description!',
        price: 999
      };

      chai.request(server)
        .put(path.join(apiPath, 'items'))
        .send(Object.assign(updateItem, data))
        .end(function(err, res){
          expect(res.status).to.equal(200);
          // expect(res.body).to.include.all.keys(all);
          // expect(res.body._id).to.equal(data._id);
          // expect(res.body.description).to.equal(data.description);
          // expect(Number(res.body.price)).to.equal(data.price);
          expect(res.text).to.include('successfully updated');
          done();
        });

    });

  });

  context('GET request to /items', function() {

    it('should return an array of items when there is no search filter', function(done) {

      chai.request(server)
      .get(path.join(apiPath, 'items'))
      .query({})
      .end(function(err, res){

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        for (let i = 0; i < res.body.length; i++) {
          expect(res.body[i]).to.include.all.keys(all);
        }

        done();
      });

    });

    it('should return an array of relevant items when there is one search filter',
    function(done) {

      let query = {
        ownerId: helper.randHex(24)
      };

      chai.request(server)
      .get(path.join(apiPath, 'items'))
      .query(query)
      .end(function(err, res){

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        for (let i = 0; i < res.body.length; i++) {
          expect(res.body[i]).to.include.all.keys(all);
          expect(res.body[i].ownerId).to.equal(query.ownerId);
        }

        done();

      });

    });

    it('should return an array of relevant items when there are multiple search filters',
    function(done) {

      let query = {
        ownerId: helper.randHex(),
        price: 100
      };

      chai.request(server)
      .get(path.join(apiPath, 'items'))
      .query(query)
      .end(function(err, res){

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        for (let i = 0; i < res.body.length; i++) {
          expect(res.body[i]).to.include.all.keys(all);
          expect(res.body[i].ownerId).to.equal(query.ownerId);
          expect(Number(res.body[i].price)).to.equal(query.price);
        }

        done();

      });

    });

  });

  context('DELETE request to /items', function() {

    let deleteItem;

    // Save a random item to the database to update in the test
    before(function (done) {

      let data = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000)
      };

     chai.request(server)
      .post(path.join(apiPath, 'items'))
      .send(data)
      .end(function(err, res){
        deleteItem = res.body;
        console.log(`\nThis item will be deleted by the test:\n`, deleteItem, "\n");
        done();
      });

    });

    it('should return a 400 error when there is no _id in the body',
    function(done) {

      chai.request(server)
        .delete(path.join(apiPath, 'items'))
        .end(function(err, res){

          let errorMessage = 'Missing ID';

          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);

          done();
       });

    });

    it('should return the deleted item when there is a valid _id',
    function(done) {

      let data = {
        _id: deleteItem._id
      };

      chai.request(server)
        .delete(path.join(apiPath, 'items'))
        .send(Object.assign(deleteItem, data))
        .end(function(err, res){

          expect(res.status).to.equal(200);
          expect(res.text).to.include(`deleted ${data._id}`);

          done();
       });

    });

  });

  context('GET request to /items/{item}', function () {

    let getItem;

    // Save a random item to the database to update in the test
    before(function (done) {

      let data = {
        name: helper.generateSomeWords(2),
        description: faker.lorem.lines(),
        ownerId: helper.randHex(24),
        price: helper.randInt(10000)
      };

     chai.request(server)
      .post(path.join(apiPath, 'items'))
      .send(data)
      .end(function(err, res){
        getItem = res.body;
        console.log(`\nThis item will be fetched by the test:\n`, getItem, "\n");
        done();
      });

    });

    it('should return an error message when there is no valid ID in the path',
    function (done) {

      let invalidId = 'Not an ID';

      let id = invalidId;

      chai.request(server)
        .get(path.join(apiPath, 'items', id))
        .end(function(err, res){

          let errorMessage = 'Invalid ID';

          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);

          done();

      });

    });

    // Only works in integration testing
    if (!process.env.MOCK_DEPENDENCIES) {

      it('should return an item when it exists',
      function (done) {

        let id = getItem._id;

        chai.request(server)
        .get(path.join(apiPath, 'items', id))
        .end(function(err, res){

          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.all.keys(all);
          expect(res.body._id).to.equal(getItem._id);
          expect(res.body.description).to.equal(getItem.description);
          expect(Number(res.body.price)).to.equal(getItem.price);
          expect(res.body.ownerId).to.equal(getItem.ownerId);
          expect(res.body.createdAt).to.equal(getItem.createdAt);
          expect(res.body.updatedAt).to.equal(getItem.updatedAt);

          done();

        });

      });

      it('should return a message when the item does not exist',
      function (done) {

        let id = helper.randHex(24);

        chai.request(server)
        .get(path.join(apiPath, 'items', id))
        .end(function(err, res){

          let message = 'not found';

          expect(res.status).to.equal(400);
          expect(res.text).to.include(message);

          done();

        });

      });

    } // end if


  });

});
