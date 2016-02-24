
module.exports = {
    "dev": {
        "src": ["<%= paths.sources %>/**/*.ts"],
        "dest": "<%= paths.temp %>/compiled/sportsbook.js",
        "options": {
            "module": "system",
            "target": "es5",
            "rootDir": ".<%= paths.sources %>",
            "noImplicitAny": true,
            "removeComments": true,
            "preserveConstEnums": true,
            "sourceMap": true,
            "declaration": true
        }
    }
};