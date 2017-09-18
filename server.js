var app = require('express')();
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var User = require('./app/models/user.js');
var dbConfig = require('./app/config/database.js');

// set up mongoose
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {useMongoClient: true});

// set up express
app.use(morgan('dev'));
app.use(session({ secret: 'ilovesarahmaciel', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// app routes
app.get('/', function(req, res) {
  res.send("Hello, world");
});

app.get('/users', function(req, res) {
  User.find().lean().exec(function (err, users) {
    return res.end(JSON.stringify(users));
  });
});

// start server
app.listen(3000, function() {
  console.log("listening on port 3000");
});