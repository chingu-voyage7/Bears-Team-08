
const makeFake = require('./make-fake');

const fakeItemController = {

  read: makeFake('read'),

  create: makeFake('create'),

  update: makeFake('update'),

  remove: makeFake('remove')

};

module.exports = fakeItemController;
