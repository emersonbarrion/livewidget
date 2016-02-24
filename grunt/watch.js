module.exports = {
    compass: {
        files: ['<%= paths.sass %>/**/*.scss'],
        tasks: ['css_dev'],
        livereload: true,
        nospawn: true
    },
    typescript: {
        files: ['<%= paths.sources %>/**/*.ts'],
        tasks: ['typescript:dev', 'concat:dist'],
        livereload: true,
        nospawn: true,
    },
    dist: {
        files: ['source/js/**/*.js', '!source/js/app/**/*.*', '!source/js/demo/**/*.*', '!source/js/base/**/*.*'],
        tasks: ['jshint:all', 'concat:dist'],
        livereload: true,
        nospawn: true,
    },
    demo: {
        files: ['build/temp/compiled/**/*.js', 'source/js/app/**/*.js', 'source/js/demo/**/*.js'],
        tasks: ['concat:demo'],
        livereload: true,
        nospawn: true,
    },
    replace: {
        files: ['source/js/base/**/*.js'],
        tasks: ['replace'],
        livereload: true,
        nospawn: true,
    },
    test: {
        files: ['source/test/**/*.js'],
        tasks: ['concat:test'],
        livereload: true,
        nospawn: true,
    }
};
