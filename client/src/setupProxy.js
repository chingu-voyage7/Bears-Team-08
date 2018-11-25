const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/*', { target: 'http://[::1]:8080' }));
  app.use(proxy('/api/auth/*', { target: 'http://[::1]:8080' }));
};
