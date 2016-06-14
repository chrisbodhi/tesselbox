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
      var linkClass;
      var href = document.createAttribute('href');
      var li = document.createElement('li');

      link.innerHTML = file;

      if (!file.includes('.')) {
        linkClass = document.createAttribute('class');
        linkClass.value = 'folder';
        link.addEventListener('click', handleDir);
      }

      href.value = '/' + file;
      link.setAttributeNode(href);

      if (linkClass) {
        link.setAttributeNode(linkClass);
      }

      li.appendChild(link);
      root.appendChild(li);
    });
  }
}

req.send();

// onclick for class='folder' to send off new xhr request
// then handle that json reponse
// and delete the `li` in the html?
function handleDir(e) {

  // aint trying to change pages rn
  e.preventDefault();
  var req = new XMLHttpRequest();

  req.open('GET', this.pathname);
  req.onload = function(e) {
    if (req.status === 200) {
      var response = JSON.parse(req.responseText);
      var files = response.files;

      files.forEach(function(file) {
        var link = document.createElement('a');
        var linkClass;
        var href = document.createAttribute('href');
        var li = document.createElement('li');

        link.innerHTML = file;

        if (!file.includes('.')) {
          linkClass = document.createAttribute('class');
          linkClass.value = 'folder';
          link.addEventListener('click', handleDir);
        }

        href.value = '/' + file;
        link.setAttributeNode(href);

        if (linkClass) {
          link.setAttributeNode(linkClass);
        }

        li.appendChild(link);
        root.appendChild(li);
      });
    }
  }
  req.send();
}
