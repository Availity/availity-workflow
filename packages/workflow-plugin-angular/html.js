const path = require('path');
const settings = require('@availity/workflow-settings');

const workflowTemplate = path.join(__dirname, './index.html');
const projectTemplate = path.join(settings.app(), 'index.html');

const workflowFavicon = path.join(__dirname, './favicon.ico');
const projectFavicon = path.join(settings.app(), 'favicon.ico');

const config = {
  template: settings.asset(workflowTemplate, projectTemplate),
  favicon: settings.asset(workflowFavicon, projectFavicon),
  title: settings.title(),
  chunksSortMode: 'dependency'
};

module.exports = config;
