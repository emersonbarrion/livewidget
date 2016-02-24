var bowerFiles = require('main-bower-files');

var standardBanner = "/*! <%= pkg.name %> v<%= pkg.version %> */\n";

module.exports = {
    options: {
        banner: global.fileHeading,
        sourceMap: false,
        sourceMapIncludeSources: false
    },
    vendor: {
        src: bowerFiles(
            "**/*.js", {
                checkExistence: true
            }),
        dest: "build/vendor/vendor.js"
    },
    vendorTest: {
        src: bowerFiles("**/*.js", {
            checkExistence: true,
            includeDev: true,
            overrides: {
                "jasmine-core": {
                    ignore: true
                }
            }
        }),
        dest: "build/vendor/vendor-test.js"
    },
    vendorCss: {
        src: (function () {
            var css = bowerFiles("**/*.css", {
                checkExistence: true,
                includeDev: false,
                overrides: {
                    foundation: {
                        ignore: true
                    }
                }
            });

            css.push("build/temp/compiled/font-awesome.css");
            css.push("build/temp/compiled/foundation.css");

            return css;
        })(),
        dest: "build/vendor/vendor.css"
    },
    dist: {
        files: global.siteBundle,
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true
        }
    },
    demo: {
        src: [
            "build/temp/compiled/demo/**/*.js",
            "source/js/demo/**/*.js"
        ],
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true
        },
        dest: "build/demo/sitestack-sportsbook-demo.js"
    },
    test: {
        files: global.siteTestBundle,
        options: {
            sourceMap: true,
            sourceMapIncludeSources: true
        }
    }
};
