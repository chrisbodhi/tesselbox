// Import the interface to Tessel hardware
var tessel = require('tessel');
var http = require('http');

var fs = require('fs');
var path = require('path');
var url = require('url');

var mount = '/mnt/sda1';

var server = http.createServer(function (request, response) {
  // Break up the url into easier-to-use parts
  var urlParts = url.parse(request.url, true);

  if (urlParts.pathname === '/dir') {
    fs.readdir(mount, function(err, files) {
      if (err) {throw new Error(err); }

      response.writeHead(200, {"Content-Type": "application/json"});
      files = files.filter(function(f) {
        return f[0] !== '.';
      });
      response.end(JSON.stringify({files: files}));
    });
  } else if (urlParts.pathname === '/') {
    showIndex(urlParts.pathname, request, response);
  } else if (!urlParts.pathname.includes('.')) {
    
  } else if (urlParts.pathname !== '/favicon.ico') {
    var file = path.join(mount, urlParts.pathname);
    console.log('mount', mount);
    console.log('file selected', file);

    fs.readFile(file, function(err, content) {
      if (err) {throw new Error('problem reading file', err); }

      response.writeHead(200, {"Content-Type": "application/pdf"});
      response.write(content)
      response.end();
    });
  }
});

server.listen(8080);
console.log('Server running at http://192.168.1.101:8080/');

// Respond to the request with our index.html page
function showIndex (url, request, response) {
  // Create a response header telling the browser to expect html
  response.writeHead(200, {"Content-Type": "text/html"});

  // Use fs to read in index.html
  fs.readFile(__dirname + '/index.html', function (err, content) {
    // If there was an error, throw to stop code execution
    if (err) {
      throw err;
    }

    // Serve the content of index.html read in by fs.readFile
    response.end(content);
  });
}
