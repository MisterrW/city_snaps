var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// app.get('/cityNames', function (req, res) {
//   res.sendFile(path.join(__dirname + '/public/countriesToCities.json'));
// });


app.use(express.static('public'));
// app.use(connect.json());

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server running. http://%s:%s', host, port);
});