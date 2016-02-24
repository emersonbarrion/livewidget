var gulp = require("gulp");

// We still depend on the bundles.json file to give us the paths :(
var bundles = require('./bundles.json');
var _ = require('./bower_components/lodash/lodash.js');
var args = require("yargs").argv;

function getBundlesById(id, data) {

    var result = _.chain(data.bundles).filter({
        "id": id
    }).map(function (b) {
        return {
            "id": b.id,
            "output": b.id + ".js",
            "files": _.map(_.pluck(b.paths, "path"), function (p) {
                return "." + p;
            })
        };
    }).value();

    return _.first(result);
}

var vendorScripts = getBundlesById('vendor.libs.js.bundle', bundles);
var vendorStyles = getBundlesById('vendor.css.bundle', bundles);

var vendorTestBundle = getBundlesById('vendor.test.libs.js.bundle', bundles);

var siteBundle = getBundlesById('site.modules.js.bundle', bundles);
var siteTestBundle = getBundlesById('site.modules.test.js.bundle', bundles);

/* Paths */
var sources = {
    // These four should be removed.
    "modules": "js/sitestack/sitestack.modules.js",
    "demoApp": "js/app/**/*.js",
    "siteStack": "js/sitestack/**/*.js",
    "accountArea": "js/demo/authentication/**/*.js",

    "js": siteBundle.files,
    "scss": "sass/**/*.scss",
    "tests": "test/acceptance/**/*.spec.js"
};

// Progression: This should be avoidable if tests and classes import their own
// dependencies.
var dependencies = vendorScripts.files;

var outputRoot = "./dist";
var tempRoot = "./temp";

var output = {
    "js": tempRoot + "/js",
    "css": tempRoot + "/css",
    "html": tempRoot,
    "docs": outputRoot + "/docs"
}

/* Vendor artefacts */
gulp.task("vendor", ["vendor:scripts:concat", "vendor:styles:concat"]);

gulp.task("vendor:scripts:concat", function () {
    var concat = require("gulp-concat");
    var sourcemaps = require("gulp-sourcemaps");

    return gulp.src(vendorScripts.files)
        .pipe(sourcemaps.init())
        .pipe(concat("vendor.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputRoot));
});

gulp.task("vendor:styles:concat", function () {
    var concat = require("gulp-concat");
    var sourcemaps = require("gulp-sourcemaps");

    return gulp.src(vendorStyles.files)
        .pipe(sourcemaps.init())
        .pipe(concat("vendor.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputRoot));
});

gulp.task("sportsbook:init", ["vendor:scripts:concat", "vendor:styles:concat", "scripts:lint", "scripts:configure", "scripts:test", "styles:lint", "styles:build", "scripts:concat", "styles:concat", "scripts:doc"]);
gulp.task("sportsbook:package", ["scripts:lint", "scripts:configure", "scripts:test", "styles:lint", "styles:build", "scripts:concat", "styles:concat", "scripts:doc"]);
gulp.task("sportsbook:watch", function () {
    gulp.watch(sources.js, ["scripts:lint", "scripts:test", "scripts:concat"]);
    gulp.watch(sources.scss, ["styles:lint", "styles:build", "styles:concat"]);
});

/* Styles*/
gulp.task("styles:concat", function () {
    var concat = require("gulp-concat");
    var sourcemaps = require("gulp-sourcemaps");

    return gulp.src(output.css + "/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(concat("sportsbook.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputRoot));
});

gulp.task("styles:build", function () {
    var sass = require("gulp-sass");
    var maps = require("gulp-sourcemaps");

    return gulp.src(sources.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(output.css));
});

gulp.task("styles:lint", function () {
    var linter = require("gulp-sass-lint");

    return gulp.src(sources.scss)
        .pipe(linter({
            "reporterOutputFormat": "Checkstyle",
            "filePipeOutput": "sass-lint.json"
        }))
        .pipe(linter.format())
        .pipe(linter.failOnError())
        .pipe(gulp.dest("./build/reports/sass-lint/"));
});

gulp.task("styles:watch", function () {
    gulp.watch(sources.scss, ["styles:lint", "styles:build", "styles:concat"]);
});

gulp.task("styles", ["styles:lint", "styles:build"]);

/* Configure */
gulp.task("scripts:configure", function () {

    var replace = require("gulp-replace");
    var rename = require("gulp-rename");
    var configuration = require("./env.json");

    var environment = _.isUndefined(args.environment) ? "default" : args.environment;

    var run = gulp.src(["./js/base/application.base.js"]).pipe(rename("application.js"));

    _.chain(configuration).keys().forEach(function (key) {

        var replacementKey = "@@" + key;
        var value = _.isUndefined(configuration[key][environment]) ? configuration[key].default : configuration[key][environment];

        run = run.pipe(replace(replacementKey, value));
    }).value();

    run.pipe(gulp.dest("./js/app"))
});

/* Linting */
gulp.task("scripts:lint", function () {

    // Progression: This will be replaced with gulp-tslint and tslint-stylish.
    // Pattern should remain identical.
    var linter = require("gulp-jshint");

    var reporters = [
        linter.reporter("jshint-stylish"),
        linter.reporter("fail")
    ];

    var scripts = gulp
        .src(sources.js)
        .pipe(linter());

    // Register the linting reporters.
    reporters.forEach(function (reporter) {
        scripts = scripts.pipe(reporter);
    });

    return scripts;
});

/* Automated tests */
gulp.task("scripts:test", function (done) {

    var config = require("./karma.conf");

    config.files = config.files
        .concat(["./dist/vendor.js"])
        .concat([
            "js/sitestack/sitestack.modules.js",
            "js/sitestack/**/*.js",
            "js/sportsbook/application/sportsbook.js",
            "js/app/application.js",
            "js/sportsbook/**/*.js",
            "js/app/**/*.js",
            "js/demo/**/*.js",
            "test/helpers/**/*.js",
            "bower_components/jasmine-given/dist/jasmine-given.js",
            sources.tests
        ]);

    var Server = require("karma").Server;
    var server = new Server(config, done);
    server.start();
});

/* Automated documentation */
gulp.task("scripts:doc", [], function () {

    var docs = require("gulp-ngdocs");

    return gulp.src(sources.js)
        .pipe(docs.process({
            html5Mode: false,
            startPage: "/",
            title: "SiteStack Sportsbook - JS Doc",
            titleLink: "/",
            bestMatch: true
        }))
        .pipe(gulp.dest(output.docs));
});

gulp.task("scripts:concat", function () {
    var concat = require("gulp-concat");
    var sourcemaps = require("gulp-sourcemaps");

    return gulp.src(sources.js)
        .pipe(sourcemaps.init())
        .pipe(concat("sportsbook.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputRoot));
});

gulp.task("scripts", ["scripts:lint", "scripts:configure", "scripts:test", "scripts:doc"]);

gulp.task("scripts:watch", function () {
    gulp.watch(sources.js, ["scripts:lint", "scripts:test", "scripts:concat"]);
});