const faker = require('faker');
const helper = require('./factory-helper');
const Factory = require('rosie').Factory;

// All fields
// let all = [
//   'name',
//   'price',
//   'description',
//   'quantity',
//   'images',
//   'ownerId',
//   'createdAt',
//   'updatedAt',
//   '_id'
// ];

// Required fields
// let required = [
//   'name',
//   'price',
//   'description',
//   'quantity',
//   'ownerId'
// ];

function objectFactory(config) {
  // Factory will generate a random quantity between 1 and (config.n) random objects
  const quantity = config.n === 0 ? 1 : 2 + helper.randInt(config.n);

  // Random values-generator for specified attributes
  const attributeGenerator = {
    name: () => helper.generateSomeWords(2),
    description: () => faker.lorem.paragraph(),
    price: () => helper.randInt(10000),
    quantity: () => 1 + helper.randInt(100),
    images: () => helper.randImages(5),
    ownerId: () => helper.randHex(24),
    createdAt: () => faker.date.past(2),
    updatedAt: () => faker.date.between(faker.date.past(1), new Date()),
    _id: () => helper.randHex(24),
  };

  // config.filter is used to override random attribute data
  const factory = new Factory().attrs(
    Object.assign(attributeGenerator, config.filter),
  );

  let objects;

  // Generate an object or an array of objects
  if (quantity === 1) {
    objects = factory.build();
  } else {
    objects = factory.buildList(quantity);
  }

  // Promise is used to mock return from database query
  return Promise.resolve(objects);
}

module.exports = objectFactory;
