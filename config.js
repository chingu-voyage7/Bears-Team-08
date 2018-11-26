const localEnv = require('dotenv').config();

if (localEnv.error) {
  throw new Error(`Error loading .env file:\n${localEnv.error}`);
}

const nodeEnv = process.env.NODE_ENV || 'development';
const port = localEnv.parsed.SERVER_PORT;
const dbUrl = // eslint-disable-line
  nodeEnv === 'production'
    ? process.env.MLAB_PRODUCTION
    : process.env.MLAB_DEVELOPMENT;

const reactType = nodeEnv === 'production' ? 'build' : 'client';

module.exports = {
  serverPort: port,
  mongoDB: {
    url: dbUrl,
    type: `${nodeEnv} database`,
  },
  reactType,
};
