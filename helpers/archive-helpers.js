var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('request');

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};
exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    cb(data.split('\n').filter(function(item){ return item.length; }));
  });
};
exports.isUrlInList = function(url, cb){
  exports.readListOfUrls(function(urls){
    if (urls.indexOf(url) > -1) {
      cb(true);
    } else {
      cb(false);
    }
  });
};
exports.addUrlToList = function(url){
  exports.isUrlInList(url, function(answer){
    if (!answer) {
      fs.appendFile(exports.paths.list, url + '\n', function(err) {
        if (err) throw err;
      });
    }
  });
};
exports.isURLArchived = function(url, cb){
  fs.open(exports.paths.archivedSites + "/" + url, 'r', function(err){
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};
exports.downloadUrls = function(){
  exports.readListOfUrls(function(urls){
    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      var content = '';
      exports.isURLArchived(url, function(archived){
        if (!archived) {
          httpRequest('http://' + url, function(error, response, body){
             if (!error && response.statusCode === 200) {
              content += body;
              fs.writeFile(exports.paths.archivedSites + '/' + url, content, function(err) {
                if (err) throw err;
              });
             } 
          });
        }
      })
    }
  });
};
