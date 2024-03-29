const path = require('path');

const html = (settings) => {
  const workflowTemplate = path.join(__dirname, './public/index.html');
  const projectTemplate = path.join(settings.app(), 'index.html');

  const workflowFavicon = path.join(__dirname, './public/favicon.ico');
  const projectFavicon = path.join(settings.app(), 'favicon.ico');

  const config = {
    template: settings.asset(workflowTemplate, projectTemplate),
    favicon: settings.asset(workflowFavicon, projectFavicon),
    title: settings.title()
  };

  return config;
};

module.exports = html;
