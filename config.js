const localEnv = require('dotenv').config();

if (localEnv.error) {
  throw new Error (`Error loading .env file:\n${localEnv.error}`);
}

let nodeEnv = process.env.NODE_ENV || 'development';
let port = localEnv.parsed.SERVER_PORT;
let dbUrl = ((nodeEnv) => {
  if (nodeEnv === 'development') {
    return localEnv.parsed.MLAB_DEVELOPMENT;
  } else if (nodeEnv === 'production') {
    return localEnv.parsed.MLAB_PRODUCTION;
  } else {
    return null;
  }
})(nodeEnv);

module.exports = {
  serverPort: port,
  mongoDB: {
    url: dbUrl,
    type: nodeEnv + ' database'
  }
};
