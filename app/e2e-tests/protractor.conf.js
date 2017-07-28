exports.config = {
  allScriptsTimeout: 120000,

  specs: [
    'scenarios.js'
  ],

  capabilities: {
  'browserName': 'firefox'
  },
	baseUrl: 'http://localhost:8000/',
  chromeOnly: true,
  rootElement: 'html',
  
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000
  }
};
