var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {

  // serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user for the session
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // set up local signup
  passport.use('local-signup', new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  }, function(req, username, password, done) {
    // async
    process.nextTick(function() {
      let email = req.body.email;
      // check if user exists with username/email
      User.findOne({ $or: [{ username: username }, { email: email }] }, function(err, user) {
        if(err)
          return done(err);
        
        if(user) {
          if(user.username === username) {
            return done(null, false, {message: "Username already exists"});
          } else {
            return done(null, false, {message: "Email already exists"});
          }
        } else {
          // create user
          var newUser = new User();
          newUser.username = username;
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if(err) throw err;

            return done(null, newUser);
          });
        }
      });
    });
  }));

  // set up local login
  passport.use('local-login', new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  }, function(req, username, password, done) {
    User.findOne({username: username}, function(err, user) {
      if(err) 
        return done(err);
      
      if(!user)
        return done(null, false, {message: "Could not find user"});

      if(!user.validatePassword(password))
        return done(null, false, {message: "Invalid password"});
      
      return done(null, user);
    });
  }));
};