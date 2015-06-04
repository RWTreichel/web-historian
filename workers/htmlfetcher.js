// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var Cron = require('cron').CronJob;

exports.job = new Cron('*/5 * * * * *', function() {
  archive.downloadUrls();
}, null, true, 'America/Los_Angeles');

// job.start();


