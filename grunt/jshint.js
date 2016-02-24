module.exports = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        verbose: true
    },
    all: [
        '<%= paths.scripts %>/**/*.js',
        'source/test/acceptance/**/*.js',
        '!<%= paths.bower %>/**/*.js', /* exclude vendor scripts */
        '!<%= paths.scripts %>/config/**/*.js', /* exclude configurations scripts */
        '!<%= paths.scripts %>/compiled/**/*.js' /* exclude typescript compiled files*/
    ]
};