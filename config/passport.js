const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// const config = require('config');
// const FBStrategy = require('passport-facebook').Strategy;
const models = require('../api/models');

const { User } = models;

// const fbAppId = config.fb.appID;
// const fbAppSecret = config.fb.appSecret;
// const fbCallbackURL = config.fb.callbackURL;

// passport local strategy
const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside localStrategy');

    // Andre's code:
    // const query = User.findOne({ email });
    // query
    //   .exec()
    //   .then(user => {
    //     // User not found
    //     if (!user) {
    //       return done(null, false, { message: 'Invalid credentials.\n' });
    //     }
    //     // Check password
    //     return user.isCorrectPassword(password, (error, same) => {
    //       if (error) {
    //         return done(error);
    //       }
    //       if (!same) {
    //         return done(null, false, { message: 'Invalid credentials.' });
    //       }
    //       return done(null, user);
    //     });
    //   })
    //   .catch(error => done(error));

    // Luc's auth in AuthController.signin strategy moved here and adapted
    return User.findOne({ email }, (error, user) => {
      if (error) {
        // res.status(500).json({
        //   error: 'Internal error please try again',
        // });
        return done(error);
      }
      if (!user) {
        // res.status(401).json({
        //   error: 'Incorrect email or password',
        // });
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return user.isCorrectPassword(password, (e, same) => {
        if (e) {
          // res.status(500).json({
          //   error: 'Internal error please try again',
          // });
          return done(e);
        }
        if (!same) {
          // res.status(401).json({
          //   error: 'Incorrect email or password',
          // });
          return done(null, false, {
            message: 'Incorrect email or password.',
          });
        }
        // // Issue token
        // const payload = { email };
        // const token = jwt.sign(payload, secret, {
        //   expiresIn: '10h',
        // });
        // res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        return done(null, user);
      });
    });
  },
);

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  console.log('Inside serializeUser');
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser');
  User.findById(id, (err, user) => {
    if (err) {
      console.error(
        `There was an error accessing the records of user with id: ${id}`,
      );
      return done(err);
    }
    return done(null, user);
  });
});

// ---------------------------Facebook Strategy----------------------------------
// passport.use(
//   new FBStrategy(
//     {
//       clientID: fbAppId,
//       clientSecret: fbAppSecret,
//       callbackURL: fbCallbackURL,
//       profileFields: ['id', 'displayName', 'emails', 'photos'],
//       passReqToCallback: true,
//     },
//     (req, accessToken, refreshToken, profile, done) => {
//       process.nextTick(() => {
//         if (!req.user) {
//           // confirm that user not loggedin
//           User.findOne({ 'social.fb.id': profile.id }, (err, user) => {
//             if (err) {
//               console.error(
//                 'There was an error accessing the dbase',
//                 err.message,
//               );
//               return done(err);
//             }
//             if (user) {
//               return done(null, user);
//             }

//             const newUser = new User();
//             newUser.social.fb.id = profile.id;
//             newUser.social.fb.token = accessToken;
//             newUser.social.fb.displayName = profile.displayName;
//             newUser.social.fb.email = profile.emails[0].value;
//             newUser.social.fb.photo = profile.photos[0].value || '';
//             newUser.save(e => {
//               if (e) {
//                 console.error(e);
//                 return done(e);
//               }
//               return done(null, newUser);
//             });
//           });
//         } else {
//           // user exists and is loggedin
//           const { user } = req; // pull the user out of the session
//           // update the current users facebook credentials
//           user.social.fb.id = profile.id;
//           user.social.fb.token = accessToken;
//           user.social.fb.displayName = profile.displayName;
//           user.social.fb.email = profile.emails[0].value;
//           user.social.fb.photo = profile.photos[0].value || '';
//           // save modifications to user
//           user.save(err => {
//             if (err) {
//               console.error(err);
//               return done(err);
//             }
//             // console.log('user fb', user.social.fb.displayName);
//             // console.log('user fb tokens',user.social.fb.token);
//             return done(null, user);
//           });
//         }
//       });
//     },
//   ),
// );

module.exports = passport;
