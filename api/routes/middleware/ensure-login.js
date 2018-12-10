// Code copied from:
// Jared Hanson
// https://github.com/jaredhanson/connect-ensure-login/blob/master/lib/ensureLoggedIn.js

function ensureLogin (options) {
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {};

  const url = options.redirectTo || '/login';
  const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

  return function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    }
    next();
  }

}

module.exports = ensureLogin;
