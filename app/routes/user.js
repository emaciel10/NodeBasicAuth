var User = require('../models/user.js');

module.exports = function(app, passport) {
  // get all users, admin only
  app.get('/users', function(req, res) {
    if(!req.isAuthenticated() || !req.user.isAdmin) {
      return res.send(401, "Unauthorized");
    }
    
    User.find().lean().exec(function (err, users) {
      return res.send(JSON.stringify(users));
    });
  });

  // get user
  app.get('/users/:username', function(req, res) {
    var username = req.params.username;
    // check if authorized
    if(req.isAuthenticated() 
    && (req.user.username === username || req.user.isAdmin) ) {
      User.findOne({username: username}, function(err, user) {
        if(err)
          throw err;

        return res.send(JSON.stringify(user));
      });
    } else {
      return res.send(401, "Unauthorized");
    }
  });

  // get users
  app.post('/users', function(req, res) {
    if(!req.isAuthenticated() || !req.user.isAdmin) {
      return res.send(401, "Unauthorized");
    }

    var user = new User();
    user.username = req.body.username;
    user.password = user.generateHash(req.body.password);
    user.email = req.body.email;
    user.save(function(err) {
      if(err)
        throw err;

      return res.send(JSON.stringify(user));
    });
  });

  app.delete('/users/:username', function(req, res) {
    // check if authorized
    var username = req.params.username;
    // check if authorized
    if(req.isAuthenticated() 
    && (req.user.username === username || req.user.isAdmin) ) {
      User.remove({username: username}, function(err) {
        if(err)
          throw err;

        return res.send('success');
      });
    }
  });
};