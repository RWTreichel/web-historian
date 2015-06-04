var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
var httpRequest = require('request');
var Cron = require('../workers/htmlfetcher');

// console.log(Cron);


exports.handleRequest = function (request, response) {
  var started = false;
  if (request.method === 'GET') {
    if (!started) {
      Cron.job.start();
    }

    var url = request.url;
    if (url === '/') {
      url = '/index.html';
    } 
    httpHelpers.serveAssets(response, url);
  }
  if (request.method === 'POST'){

    httpHelpers.collectData(request, function(file){

      var website = (file.toString().split('=').pop()); 

      archive.isUrlInList(website, function(found) {
        if (found) {
          archive.isURLArchived(website, function(exists) {
            if (exists) {
              //display page
              httpHelpers.sendRedirect(response, '/' + website);
            } else {
              //redirect loading
              httpHelpers.sendRedirect(response, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(website);
          httpHelpers.sendRedirect(response, '/loading.html');
        }
      });
    });
  }
};
