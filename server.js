var app = require('express')();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

mongoose.connect("mongodb://admin:admin@cluster0-shard-00-00-d2tbf.mongodb.net:27017,cluster0-shard-00-01-d2tbf.mongodb.net:27017,cluster0-shard-00-02-d2tbf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin", {useMongoClient: true});
var User = mongoose.model('user', { local: { username: String, password: String, email: String }});

// set up express
app.use(morgan('dev'));
app.use(session({ secret: 'ilovesarahmaciel', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.send("Hello, world");
});

app.get('/users', function(req, res) {
  User.find().lean().exec(function (err, users) {
    return res.end(JSON.stringify(users));
  });
});

app.listen(3000, function() {
  console.log("listening on port 3000");
});