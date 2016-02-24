module.exports = function (grunt) {
    // load the bundles.json file from disk
    var bundles = grunt.file.readJSON('bundles.json');


    // setup global variables
    global.fileHeading = "/*! <%= pkg.name %> v<%= pkg.version %> */\n";

    global.vendorBundle = getBundlesById('vendor.libs.js.bundle', bundles);
    global.vendorTestBundle = getBundlesById('vendor.test.libs.js.bundle', bundles);
    global.siteBundle = getBundlesById('site.modules.js.bundle', bundles);
    global.siteTestBundle = getBundlesById('site.modules.test.js.bundle', bundles);

    global.scriptsBundle = getBundlesByType('js', bundles);
    global.cssBundle = getBundlesById("site.sportsbook.css.bundle", bundles);

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg: grunt.file.readJSON('package.json'),
            paths: {
                css: 'source/css',
                sass: 'source/sass',
                scripts: 'source/js',
                bower: 'bower_components',
                locales: 'build/temp/config/locales',
                package: '/git/sitestack/sportsbook-bower',
                sources: "source",
                temp: "build/temp"
            }
        },
        loadGruntTasks: {
            pattern: ['grunt-*', 'main-bower-files', '!grunt-template-jasmine-istanbul'],
            config: require('./package.json'),
            scope: 'devDependencies'
        }
    });
};

// retrieve all bundles of the given type
function getBundlesByType(type, file) {
    var returnObject = {};

    // retrieve the bundle configuration
    for (var i = 0; i < file.bundles.length; i++) {
        // get a single bundle object
        var bundle = file.bundles[i];
        // create an array of the files associated with that bundle
        var fileArray = [];
        // if the bundle is of the matching type
        if (bundle.type == type) {
            // traverse the paths
            for (var path in bundle.paths) {
                fileArray.push("." + bundle.paths[path].path);
            }
            // create a hashtable
            returnObject["." + bundle.output] = fileArray;
        }
    }

    return returnObject;
}

// retrieve all bundles of the given type
function getBundlesById(id, file) {
    var returnObject = {};

    // retrieve the bundle configuration
    for (var i = 0; i < file.bundles.length; i++) {
        // get a single bundle object
        var bundle = file.bundles[i];
        // create an array of the files associated with that bundle
        var fileArray = [];
        // if the bundle is of the matching type
        if (bundle.id == id) {
            // traverse the paths
            for (var path in bundle.paths) {
                fileArray.push("." + bundle.paths[path].path);
            }
            // create a hashtable
            returnObject["." + bundle.output] = fileArray;
        }
    }

    return returnObject;
}
