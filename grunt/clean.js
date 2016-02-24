module.exports = {
    options: {
        force: true
    },
    package: [
        '<%= paths.package %>/src/**/*', '<%= paths.package %>/demo/js/**/*', '<%= paths.package %>/demo/css/**/*'
    ],
    package_sitestack: [
        '<%= paths.package_sitestack %>/src/**/*'
    ],
    build: [
        "build/**/*"
    ]
};