module.exports = function(app, passport) {
  app.post('/login', function(req, res) {
    passport.authenticate('local-login', function(err, user, options) {
      if(user) {
        req.login(user, function(err) {
          if(err)
            res.redirect('/login');
          else {
            res.redirect('/users/' + user.username);
          }
        });
      } else {
        res.send(options.message);
      }
    })(req, res);
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/signup', function(req, res) {
    passport.authenticate('local-signup', function(err, user, options) {
      if(user) {
        res.send('success');
      } else {
        res.send(options.message);
      }
    })(req, res);
  });
};