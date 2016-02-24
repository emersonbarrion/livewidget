module.exports.copy = {
    files: [
        {
            src: ["index.html", "test-runner.html"],
            dest: "build/"
        },
        {
            src: ["deploy/Deploy.config", "deploy/deploy.ps1", "web.config"],
            dest: "build/",
            expand: true,
            flatten: true
        },
        {
            src: ["**/*.html"],
            cwd: "source/js/",
            dest: "build/templates/",
            expand: true,
            flatten: false
        },
        {
            src: ["config/**/*.js"],
            cwd: "source/js/",
            dest: "build/templates/",
            expand: true,
            flatten: false
        },
        {
            src: ["**/*.js"],
            cwd: "bower_components/angular-i18n/",
            dest: "build/angular-i18n/",
            expand: true
        },
        {
            src: [
                "bower_components/jasmine-core/lib/jasmine-core/boot.js",
                "bower_components/jasmine-core/lib/jasmine-core/jasmine.js",
                "bower_components/jasmine-core/lib/jasmine-core/jasmine-html.js",
                "bower_components/jasmine-core/lib/jasmine-core/jasmine.css"
            ],
            dest: "build/test/",
            expand: true,
            flatten: true
        }
    ]
};
