module.exports = {
    basePath: "./",

    reporters: ["progress", "html", "coverage"],

    files: [],

    exclude: [],

    autoWatch: false,

    frameworks: ["jasmine"],

    browsers: ["PhantomJS"],

    plugins: [
        "karma-jasmine",
        "karma-junit-reporter",
        "karma-chrome-launcher",
        "karma-firefox-launcher",
        "karma-phantomjs-launcher",
        "karma-coverage",
        "karma-htmlfile-reporter"
    ],

    junitReporter: {
        outputFile: 'unit.xml',
        suite: 'unit'
    },

    singleRun: true,

    coverageReporter: {
        type: 'html',
        dir: 'build/reports/coverage/'
    },

    htmlReporter: {
        outputFile: 'build/reports/test/units.html'
    }
};