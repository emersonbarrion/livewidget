var HtmlReporter = require('protractor-html-screenshot-reporter');
var reporter = new HtmlReporter({
    baseDirectory: './Test/ui/report', // Unlike the other paths in the configuration, the base directory is relative to the working directory.
    docTitle: 'Protractor Reporter',
    docName: 'index.html'
});

// Protractor configuration
exports.config = {
    // The address of a running selenium server.
    // Selenium can be started with "webdriver-manager start" if webdriver has been installed using npm.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the configuration file location passed
    // to proractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['specs/**/*.js'],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true, // Use colors in the command line report.
        defaultTimeoutInterval:60000
    },

    onPrepare: function () {
        jasmine.getEnv().addReporter(reporter);
    }
};