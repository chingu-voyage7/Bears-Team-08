require('dotenv').load();
const path = require('path');
const mock = require('mock-require');
const chaiHttp = require('chai-http');
const chai = require('chai');

const expect = chai.expect;
chai.use(chaiHttp);

const faker = require('faker');
const helper = require('./helpers/factory-helper');

const apiPath = '/api';

// Set variable MOCK=true in .env or shell to mock dependencies:
if (process.env.MOCK_DEPENDENCIES) {
  console.log('\nMocking Database and Item Controller\n');
  /*
  Usage:
  mock(path_to_real, path_to_fake):
  both paths are relative to the current file
   */
  mock('../database', () => {});
  mock('../api/controllers/item-controller', './helpers/fake-item-controller');

  // to stop mocking : mock.stopAll();
}

// To bypass authentication use:
// mock('../api/routes/middleware/ensure-login', () => ((req, res, next) => next() ));

// Note: need to pass --exit flag to mocha in package.json scripts.test to close the server after tests
const server = require('../index');

// A test user registered in the database
// Used for authenticated requests
const userCredentials = {
  email: "fake@fake.me",
  password: "123456"
};

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

describe('Item routes', function () {

  context('Protected routes: POST, PUT, DELETE', function () {

    // Persist session
    let chaiAgent;

    before(function (done) {

      chaiAgent = chai.request.agent(server);

      chaiAgent
        .post(path.join(apiPath, '/auth/signin'))
        .send(userCredentials)
        .end((err, res) => {
          done();
        });

    });

    after(function () {

      chaiAgent.close();

    });

    context('POST request to /items', function (){

      it('should return an object with item data when every field is filled in', done => {
        const data = {
          name: helper.generateSomeWords(2),
          description: faker.lorem.lines(),
          price: helper.randInt(10000),
          quantity: 1 + helper.randInt(100),
          images: helper.randImages(5),
        };

         chaiAgent
        .post(path.join(apiPath, 'items'))
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys(all);
          expect(res.body.name).to.equal(data.name);
          expect(res.body.description).to.equal(data.description);
          // expect(res.body.ownerId).to.equal(ownerId);
          expect(Number(res.body.price)).to.equal(data.price);
          done();
        });
      });

      it('should return a 400 error when missing required fields', done => {
        const data = {
          name: helper.generateSomeWords(2),
        };

        const errorMessage = 'validation failed';

        chaiAgent
        .post(path.join(apiPath, 'items'))
        .send(data)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);
          done();
        });
      });
    });

    context('PUT request to /items', () => {
      let updateItem;

      // Save a random item to the database to update it in the test
      before(done => {
        const data = {
          name: helper.generateSomeWords(2),
          description: faker.lorem.lines(),
          ownerId: helper.randHex(24),
          price: helper.randInt(10000),
          quantity: 1 + helper.randInt(100),
          images: helper.randImages(5),
        };

        chaiAgent
        .post(path.join(apiPath, 'items'))
        .send(data)
        .end((err, res) => {
          updateItem = res.body;
          console.log(
            '\nThis item will be updated by the test:\n',
            updateItem,
            '\n',
          );
          done();
        });
      });

      it('should return a 400 error when there is no request body', done => {
        const errorMessage = 'Missing ID';

        chaiAgent
        .put(path.join(apiPath, 'items'))
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.include(errorMessage);
          done();
        });
      });

      it('should return updated item when there is one field to update', done => {
        const data = {
          _id: updateItem._id,
          name: 'Updated Name!',
        };

        chaiAgent
        .put(path.join(apiPath, 'items'))
        .send(Object.assign(updateItem, data))
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.include.all.keys(all);
          expect(res.body._id).to.equal(data._id);
          expect(res.body.name).to.equal(data.name);
          done();
        });
      });

      it('should return updated item when there are multiple fields to update', done => {
        const data = {
          _id: updateItem._id,
          description: 'Updated description!',
          price: 999,
        };

        chaiAgent
        .put(path.join(apiPath, 'items'))
        .send(Object.assign(updateItem, data))
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.include.all.keys(all);
          expect(res.body._id).to.equal(data._id);
          expect(res.body.description).to.equal(data.description);
          expect(Number(res.body.price)).to.equal(data.price);
          done();
        });
      });
    });

    context('DELETE request to /items', () => {
      let deleteItem;

      // Save a random item to the database to update in the test
      before(done => {
        const data = {
          name: helper.generateSomeWords(2),
          description: faker.lorem.lines(),
          ownerId: helper.randHex(24),
          price: helper.randInt(10000),
          quantity: 1 + helper.randInt(100),
          images: helper.randImages(5),
        };

        chaiAgent
          .post(path.join(apiPath, 'items'))
          .send(data)
          .end((err, res) => {
            deleteItem = res.body;
            console.log(
              '\nThis item will be deleted by the test:\n',
              deleteItem,
              '\n',
            );
            done();
          });
      });

      it('should return a 400 error when there is no _id in the body', done => {

        chaiAgent
          .delete(path.join(apiPath, 'items'))
          .end((err, res) => {
            const errorMessage = 'Missing ID';

            expect(res.status).to.equal(400);
            expect(res.text).to.include(errorMessage);

            done();
          });
      });

      it('should return the deleted item when there is a valid _id', done => {
        const data = {
          _id: deleteItem._id,
        };

        chaiAgent
          .delete(path.join(apiPath, 'items'))
          .send(Object.assign(deleteItem, data))
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.include(`deleted ${data._id}`);

            done();
          });
      });
    });

  });

  context('Unprotected routes: GET', function () {

    context('GET request to /items', () => {
      it('should return an array of items when there is no search filter', done => {

        chai
          .request(server)
          .get(path.join(apiPath, 'items'))
          .query({})
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');

            for (let i = 0; i < res.body.length; i++) {
              expect(res.body[i]).to.include.all.keys(all);
            }

            done();
          });
      });

      it('should return an array of relevant items when there is one search filter', done => {
        const query = {
          ownerId: helper.randHex(24),
        };

        chai
          .request(server)
          .get(path.join(apiPath, 'items'))
          .query(query)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');

            for (let i = 0; i < res.body.length; i++) {
              expect(res.body[i]).to.include.all.keys(all);
              expect(res.body[i].ownerId).to.equal(query.ownerId);
            }

            done();
          });
      });

      it('should return an array of relevant items when there are multiple search filters', done => {
        const query = {
          ownerId: helper.randHex(),
          price: 100,
        };

        chai
          .request(server)
          .get(path.join(apiPath, 'items'))
          .query(query)
          .end((err, res) => {
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

    context('GET request to /items/{item}', () => {
      let getItem;

      // Save a random item to the database to update in the test
      before(done => {

        const data = {
          name: helper.generateSomeWords(2),
          description: faker.lorem.lines(),
          ownerId: helper.randHex(24),
          price: helper.randInt(10000),
          quantity: 1 + helper.randInt(100),
          images: helper.randImages(5),
        };


        let chaiAgent = chai.request.agent(server);

        chaiAgent
          .post(path.join(apiPath, '/auth/signin'))
          .send(userCredentials)
          .then(res => {

            chaiAgent
            .post(path.join(apiPath, 'items'))
            .send(data)
            .end((err, res) => {
              getItem = res.body;
              console.log(
                '\nThis item will be fetched by the test:\n',
                getItem,
                '\n',
              );
              chaiAgent.close();
              done();
            });
          })
          .catch(error => console.error('Error:', error.message));

      });

      it('should return an error message when there is no valid ID in the path', done => {
        const invalidId = 'Not an ID';

        const id = invalidId;

        chai
          .request(server)
          .get(path.join(apiPath, 'items', id))
          .end((err, res) => {
            const errorMessage = 'Invalid ID';

            expect(res.status).to.equal(400);
            expect(res.text).to.include(errorMessage);

            done();
          });
      });

      // Only works in integration testing
      if (!process.env.MOCK_DEPENDENCIES) {
        it('should return an item when it exists', done => {
          const id = getItem._id;

          chai
            .request(server)
            .get(path.join(apiPath, 'items', id))
            .end((err, res) => {
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

        it('should return a message when the item does not exist', done => {
          const id = helper.randHex(24);

          chai
            .request(server)
            .get(path.join(apiPath, 'items', id))
            .end((err, res) => {
              const message = 'not found';

              expect(res.status).to.equal(400);
              expect(res.text).to.include(message);

              done();
            });
        });
      } // end if
    });

  });


});
