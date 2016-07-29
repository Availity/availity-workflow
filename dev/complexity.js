var globby = require('globby');
var plato = require('plato');
var Promise = require('bluebird');

var logger = require('../logger');
var context = require('../context');

var complexity = function _complexity() {

  var files = globby.sync(context.settings.js.src);
  var excludeFiles = /.*-spec\.js/;


  var options = {
    title: 'Code Complexity Report',
    exclude: excludeFiles
  };

  var outputDir = context.settings.js.reportsDir + '/complexity';

  return new Promise(function(resolve) {

    plato.inspect(files, outputDir, options, function platoCompleted(report) {

      var overview = plato.getOverviewReport(report);
      if (context.settings.args.verbose) {
        logger.info(overview.summary);
      }

      resolve();

    });

  });


};

module.eports = complexity;
