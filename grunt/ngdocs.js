module.exports = {
    options: {
        dest: "build/reports/docs",
        scripts: [
            "<%= paths.bower %>/angular/angular.js",
            "<%= paths.bower %>/angular-animate/angular-animate.js"
        ],
        html5Mode: false,
        startPage: "/",
        title: "SiteStack Sportsbook - JS Doc",
        titleLink: "/docs",
        bestMatch: true
    },
    all: [
        "<%= paths.scripts %>/sitestack/**/*.js",
        "<%= paths.scripts %>/sportsbook/**/*.js"
    ]
}
