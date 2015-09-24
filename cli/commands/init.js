var inquirer = require('inquirer');
var semver = require('semver');
var _ = require('lodash');
var utils = require('../../utils');
var Joi = require('joi');

module.exports = function(cli) {

  cli.program
    .command('init')
    .description('initialize project meta data: package.json, bower.json, availity.json and README.md')
    .action(function action() {

      var questions = [
        {
          name: 'author',
          message: 'author name:',
          default: _.get(cli.manifests.availity.json, 'author.name') || null,
          validate: function(value) {

            var schema = Joi.string();
            var valid = Joi.validate(value, schema);

            if (!valid.error) {
              return true;
            }

            return 'Please enter name for project author';
          }
        },
        {
          name: 'email',
          message: 'author email:',
          default: _.get(cli.manifests.availity.json, 'author.email') || null,
          validate: function validate(value) {

            var schema = Joi.string().email();
            var valid = Joi.validate(value, schema);

            if (!valid.error) {
              return true;
            }

            return 'Please enter valid email of project author';
          }
        },
        {
          name: 'name',
          message: 'project name:',
          default: cli.manifests.availity.json.name || null,
          filter: function(val) {
            return val.toLowerCase();
          },
          validate: function(value) {

            var schema = Joi.string().regex(/^[a-z][a-z0-9\-]+$/i).min(1).max(214);
            var valid = Joi.validate(value, schema);

            if (!valid.error) {
              return true;
            }

            return  'Enter valid project name. See https://docs.npmjs.com/files/package.json#name for more details.';
          }
        },
        {
          name: 'description',
          message: 'project description:',
          default: cli.manifests.availity.json.description || null
        },
        {
          name: 'version',
          message: 'project version:',
          default: cli.manifests.availity.json.version || '1.0.0',
          validate: function(value) {

            var valid = semver.valid(value);

            if (valid) {
              return true;
            }

            return 'Enter valid semver version number.  Please see http://semver.org/spec/v2.0.0.html for more details.';
          }
        },
        {
          name: 'url',
          message: 'git url:',
          default: cli.manifests.availity.json.url || null
        },
        {
          name: 'license',
          message: 'license',
          default: cli.manifests.availity.json.license || 'UNLICENSED'
        },
        {
          name: 'keywords',
          message: 'keywords - separated by commas:',
          default: _.get(cli.manifests.availity.json, 'keywords', []).join(','),
          filter: function filter(val) {

            var result = (val.toLowerCase() || '').split(',');
            return _.map(result, function(keyword) {
              return keyword.trim();
            });

          },
          validate: function validate(value) {

            var schema = Joi
              .array().items(
                Joi.string().regex(/^[a-z0-9\-]+$/).max(30)
              )
              .single();

            var values = (value.toLowerCase() || '').split(',');
            values = _.map(values, function(keyword) {
              return keyword.trim();
            });

            var valid = Joi.validate(values, schema);

            if (!valid.error) {
              return true;
            }

            return 'Keywords must be unique, start with a letter and can only contain alpha and dashes';
          }
        }
      ];

      inquirer.prompt(questions, function(answers) {
        cli.answers = answers;
        utils.write(cli);
      });

    });
};
