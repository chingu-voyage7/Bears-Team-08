// Code copied from:
// Jared Hanson
// https://github.com/jaredhanson/connect-ensure-login/blob/master/lib/ensureLoggedOut.js

function ensureLogout (options) {
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {};

  const url = options.redirectTo || '/';

  return function(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.redirect(url);
    }
    next();
  }
}

module.exports = ensureLogout;
