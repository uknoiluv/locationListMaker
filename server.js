
var path = require('path');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res){
  res.render('index');
});

var server = app.listen(3000, function(){
  console.log('Listening on port :', server.address().port);
});

// "mongoose": "^3.8.17",
// "body-parser": "^1.9.0",
// "express-session": "^1.8.2",
// "bcrypt": "0.8.0"
