var app = require('express')();
var mongoose = require('mongoose');
mongoose.connect("mongodb://admin:admin@cluster0-shard-00-00-d2tbf.mongodb.net:27017,cluster0-shard-00-01-d2tbf.mongodb.net:27017,cluster0-shard-00-02-d2tbf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin", {useMongoClient: true});

var User = mongoose.model('user', { username: String, password: String, email: String });

app.get('/', function(req, res) {
  User.find().lean().exec(function (err, users) {
    return res.end(JSON.stringify(users));
  });
});

app.listen(3000, function() {
  console.log("listening on port 3000");
});