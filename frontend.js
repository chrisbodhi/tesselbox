var root = document.getElementById('root');

// Create a new XHR for communicating requests to our Tessel server
var req = new XMLHttpRequest();

req.open('GET', '/dir');
req.onload = function(e) {
  if (req.status === 200) {
    var response = JSON.parse(req.responseText);
    var files = response.files;
    files.forEach(function(file) {
      var link = document.createElement('a');
      var href = document.createAttribute('href');
      var li = document.createElement('li');
      var linkClass = document.createAttribute('class');

      link.innerHTML = file;

      if (file.includes('.')) {
        linkClass.value = 'file';
        link.addEventListener('click', handleFile);
      } else {
        linkClass.value = 'folder';
        link.addEventListener('click', handleDir);
      }

      href.value = file;
      link.setAttributeNode(href);
      link.setAttributeNode(linkClass);

      li.appendChild(link);
      root.appendChild(li);
    });
  }
}

req.send();

// and delete the `li` in the html?
function handleDir(e) {

  // aint trying to change pages rn
  e.preventDefault();
  var currentLinks = document.getElementsByTagName('li');
  clearOut(currentLinks);

  var req = new XMLHttpRequest();
  var parentDir = this.pathname;
  req.open('GET', parentDir);
  req.onload = function(e) {
    if (req.status === 200) {
      var response = JSON.parse(req.responseText);
      var files = response.files;
      files.forEach(function(file) {
        var link = document.createElement('a');
        var href = document.createAttribute('href');
        var li = document.createElement('li');
        var linkClass = document.createAttribute('class');

        link.innerHTML = file;

        if (file.includes('.')) {
          linkClass.value = 'file';
          link.addEventListener('click', handleFile);
        } else {
          linkClass.value = 'folder';
          link.addEventListener('click', handleDir);
        }

        href.value = parentDir + '/' + file;
        link.setAttributeNode(href);
        link.setAttributeNode(linkClass);

        li.appendChild(link);
        root.appendChild(li);
      });
    }
  }
  req.send();
}

function handleFile(e) {
  e.preventDefault();
  var iframe = document.getElementById('content');
  var src = document.createAttribute('src');
  var title = document.getElementById('file-title');
  src.value = this.href;
  title.innerText = this.text;
  iframe.setAttributeNode(src);
}

function clearOut(links) {
  for (var i = 0; i < links.length; i++) {
    links[i].remove();
  }
}