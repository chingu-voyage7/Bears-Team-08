const express = require('express');
const path = require('path');
const config = require('./config');
const cors = require('cors');
const bodyParser  = require('body-parser');

const router = require('./api/routes');

const port = process.env.PORT || config.serverPort;

const app = express();

// MISC
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client/build')));

// ROUTES
app.use(router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});



app.listen(port, () => console.log(`App listening on port ${port}!\n`));

// Exporting app to be able to require it in the tests
module.exports = app;
