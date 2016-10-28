const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//  For use with a local strategy:
exports.setup = function() {
  //  Passport configuration
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, findAndComparePassword));
  //  converts user to user id
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
        done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });

};

function findAndComparePassword(username, password, done) {
  //  Look up the user by username
  User.findOne({username: username}).then(function(user) {
    if (!user) {
      return done(null, false);
    }
    //  Compare the password
    user.comparePassword(password).then(function(isMatch) {
      if (isMatch) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }).catch(function(err) {
    console.log('Error finding user', err);
    done(err);
  });

  //  Indicate whether or not it matched
}
