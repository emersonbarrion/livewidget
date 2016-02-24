module.exports = function (grunt) {
    grunt.registerTask("css_dev", ["sass:dev", "cssmin"]);
    grunt.registerTask("tests", ["replace", "concat:dist", "concat:demo", "concat:test", "jasmine"]);
    grunt.registerTask("dependencies", ["concat:vendor", "concat:vendorTest", "concat:vendorCss"]);
    grunt.registerTask("dev", [
        "clean:build",
        "copy",
        "css_dev",
        "dependencies",
        "replace",
        "typescript:dev",
        "jshint",
        "concat:dist",
        "concat:demo",
        "concat:test",
        "jasmine",
        "ngdocs"
    ]);
    grunt.registerTask("package", ["dev", "clean:package"]);
    grunt.registerTask("watch_dev", ["watch"]);
    grunt.registerTask("demo", ["package", "concat:demo"]);
    grunt.registerTask("demo_watch", ["demo", "watch"]);
    grunt.registerTask("demo_keepalive", ["demo", "connect"]);
};
