var express = require('express');
var fs = require('fs');
var tessel = require('tessel');

var app = express();
var mount = '/mnt/sda1';
var port = 8080;

// Respond to the request with our index.html page
function showIndex (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});

  fs.readFile(__dirname + '/index.html', function (err, content) {
    if (err) { throw new Error(err); }

    response.end(content);
  });
}

// Makes available the files in the USB drive inserted into the top port
app.use(express.static(mount));

app.get('/', function (request, response) {
  showIndex(request, response);
});

app.get('/dir', function (request, response) {
  fs.readdir(mount, function(err, files) {
    if (err) {throw new Error(err); }

    response.writeHead(200, {"Content-Type": "application/json"});
    files = files.filter(function(f) {
      return f[0] !== '.';
    });
    response.end(JSON.stringify({files: files}));
  });
});

app.listen(port, function() {
  console.log('Server running at http://192.168.1.101:' + port);
});
