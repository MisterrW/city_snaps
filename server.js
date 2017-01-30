var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// app.get('/cityNames', function (req, res) {
//   res.sendFile(path.join(__dirname + '/public/countriesToCities.json'));
// });
var port = process.env.PORT || 3000;

app.use(express.static('public'));
// app.use(connect.json());

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server running. http://%s:%s', host, port);
});