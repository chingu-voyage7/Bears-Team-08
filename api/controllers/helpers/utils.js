const ObjectId = require('mongodb').ObjectID;
const xssFilters = require('xss-filters');

function isObject (candidate) {
  return Object.prototype.toString.call(candidate) === '[object Object]';
}

function checkProperty (o, p) {
  return isObject(o) ? Object.hasOwnProperty.call(o, p) : false;
}

// Code by Rory Bradford:
// https://github.com/roryrjb/is-hex
function isHex (input) {
  const hexRegEx = /([0-9]|[a-f])/gim;
  return typeof input === 'string' && (input.match(hexRegEx) || []).length === input.length;
}

// Used to convert an express.js req.body into a regular JS object
// Danger: this makes it vulnerable to XSS attacks
function dataToObject (data) {
  let result;
  if (!data) {
    result = {};
  } else if (!isObject(data)) {
    try {
      result = JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error(`\nCould not parse data in the function dataToObject.\n\nError:\n\n${error.message}\n`);
      result = {};
    }
  } else {
    result = data;
  }
  return result;
}

// Get data
function getFormData (bodyData) {
  let body = dataToObject(bodyData);
  let data = {};
  for (let property in body) {
    // Ignore prototype properties and remove _id
    if (!data[property] && checkProperty(body, property) && property !== '_id') {
      // Use xssFilters to sanitize data
      data[property] = xssFilters.inHTMLData(body[property]);
    }
  }
  return data;
}

// Get _id and convert into Mongo ID object
function getId (bodyData) {
  let body = dataToObject(bodyData);
  let id;
  if (checkProperty(body, '_id') && isHex(body._id)) {
    try {
      id = new ObjectId(body._id);
    }
    catch (error) {
      console.error(`\nCould not parse _id in the function getId.\n\nError:\n${error.message}\n`);
      id = null;
    }
  } else {
    id = null;
  }
  return id;
}

let utils = {
  getFormData: getFormData,
  getId: getId,
  checkProperty: checkProperty,
  isObject: isObject
};

module.exports = utils;
