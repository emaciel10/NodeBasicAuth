var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var User = require('./app/models/user.js');
var dbConfig = require('./app/config/database.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');

// App Setup ////////////////////////////////////////////////////
// set up express
var app = express();

// set up cookie parser
app.use(cookieParser());
// set up body parser
app.use(bodyParser.json());
// support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// set up express
app.use(morgan('dev'));
app.use(session({ secret: 'ilovesarahmaciel', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// set up mongoose
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {useMongoClient: true});
// set up passport
require('./app/config/passport')(passport);
/////////////////////////////////////////////////////////////////


// Routes ///////////////////////////////////////////////////////
// authentication routes
require('./app/routes/auth')(app, passport);
// users routes
require('./app/routes/user')(app, passport);
/////////////////////////////////////////////////////////////////

// basic login page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/app/public/index.html'));
});

// start server
app.listen(3000, function() {
  console.log("listening on port 3000");
});