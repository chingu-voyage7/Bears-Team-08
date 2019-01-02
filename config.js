const localEnv = require('dotenv-flow').config({
  default_node_env: 'development',
});

if (localEnv.error) {
  throw new Error(`Error loading .env file:\n${localEnv.error}`);
}

const nodeEnv = process.env.NODE_ENV || 'development';
const port = localEnv.parsed.SERVER_PORT;
const dbUrl = localEnv.parsed.DB_URL;

const reactType = nodeEnv === 'production' ? 'build' : 'client';
const logFormat = nodeEnv === 'production' ? 'combined' : 'dev';

module.exports = {
  serverPort: port,
  mongoDB: {
    url: dbUrl,
    type: `${nodeEnv} database`,
  },
  reactType,
  logFormat,
};
