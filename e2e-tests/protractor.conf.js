exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'scenarios.js'
  ],

  capabilities: [{
  'browserName': 'firefox'
  }],

  //baseUrl: 'http://localhost:8000/app/',
  
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
