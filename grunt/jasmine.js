
var grunt = require("grunt");
var _ = require("lodash");

var jasmine = {
    dev: {
        src: [
            "build/dist/sitestack-sportsbook.js",
            "build/demo/sitestack-sportsbook-demo.js"
        ],
        options: {
            vendor: ["build/vendor/vendor-test.js"],
            specs: "build/test/sitestack-sportsbook-test.js",
            summary: true,
            template: require('grunt-template-jasmine-istanbul'),
            templateOptions: {
                coverage: 'build/reports/coverage/coverage.json',
                report: 'build/reports/coverage',
                thresholds: {
                    lines: 50,
                    statements: 50,
                    branches: 50,
                    functions: 50
                }
            }
        }
    }
};

module.exports = jasmine;