var express = require('express');
var fs = require('fs');
var path = require('path');
// var tessel = require('tessel');

var app = express();
// var mount = '/mnt/sda1';
var mount = '/Volumes/USB\ DISK';
var port = 8080;

// Respond to the request with our index.html page
function showIndex (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  console.log('about to send index');
  fs.readFile(__dirname + '/index.html', function (err, content) {
    if (err) { throw new Error(err); }

    response.end(content);
  });
}

app.get('/', function (request, response) {
  showIndex(request, response);
});

// Make available the files in the USB drive inserted into the top port
app.use(express.static(mount));

// todo: where to call this?
function start() {
  fs.readdir(mount, function(err, files) {
    if (err) {throw new Error(err); }

    files
      .filter(function(f) {
        return f[0] !== '.';
      })
      .forEach(function(file) {
        console.log('   mount', mount);
        var filePath = path.join(mount, file);
        fs.stat(filePath, function(err, stats) {
          if (stats.isDirectory()) {
            addRoute(file);
          }
        });
      });
  });
}
// start();

// app.get('/AW', function (request, response) {
//   fs.readdir(mount + '/AW', function(err, files) {
//     if (err) {throw new Error(err); }

//     // response.writeHead(200, {"Content-Type": "application/json"});
//     files = files.filter(function(f) {
//       return f[0] !== '.';
//     });
//     console.log('files', files);
//     // response.end(JSON.stringify({files: files}));
//   });
// })

// Endpoint for AJAX request from index.html
app.get('/dir', function (request, response) {
  fs.readdir(mount, function(err, files) {
    if (err) {throw new Error(err); }
    console.log('working on that ajax');
    response.writeHead(200, {"Content-Type": "application/json"});
    files = files.filter(function(f) {
      return f[0] !== '.';
    });
    response.end(JSON.stringify({files: files}));
  });
});

// Add routes for files that are, in reality, *directories*!
app.get(/[^A-z0-9\s]/, function (request, response) {
  console.log('in app.get', request.url);
  // => in app.get /Coding%20Tests/
  var newDir = request.url.replace('%20', ' ');
  fs.readdir(path.join(mount, newDir), function(err, files) {
    if (err) {throw new Error(err); }

    response.writeHead(200, {"Content-Type": "application/json"});
    files = files.filter(function(f) {
      return f[0] !== '.';
    });
    console.log('files', files);
  //   // might want to serve another template-like HTML page
  //   // and send this JSON that way
    response.end(JSON.stringify({files: files}));
  });
});

app.listen(port, function() {
  console.log('Server running at http://192.168.1.101:' + port);
});
