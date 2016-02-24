module.exports = {
    options: {
        banner: global.fileHeading,
        sourceMap: true
    },
    default: {
        files: {
            "./build/dist/sitestack-sportsbook.css": ["build/temp/sportsbook.css"]
        }
    }
}