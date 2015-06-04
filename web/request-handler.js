var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var httpRequest = require('request');


var processFile = function(response, content) {
  response.writeHead(200, httpHelpers.headers);
  response.write(archive.paths.list);
  response.end(content);
};


exports.handleRequest = function (request, response) {
  var content = '';
  var file = '';

  if (request.url === '/') {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(error, data){
      if (error) {
        response.writeHead(404, httpHelpers.headers);
        response.end('<h1>404 Could not find</h1>');
      }
      content += data;
      processFile(response, content);
    });
  }

  // if (request.method === 'GET') {
    
  // }
  
  if (request.method === 'POST'){

    request.on('data', function(chunk) {
      file += chunk;
    });

    request.on('end', function() {
      var website = (file.toString().split('=').pop());
      var content = '';

      fs.appendFile(archive.paths.list, website + '\n', function(err) {
        if (err) throw err;
      });

      httpRequest('http://' + website, function(error, response, body){
        if (!error && response.statusCode === 200) {
          content += body;
          fs.writeFile(archive.paths.archivedSites + '/' + website, content, function(err) {
            if (err) throw err;
            console.log('saved');
          });
        }
      });

    });
  }
};
