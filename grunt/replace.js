module.exports = function (grunt) {

    var env = grunt.option('env');
    console.log("[ENV] " + env);

    return {
        default: {
            options: {
                patterns: [{
                        "match": "sourcePath",
                        "replacement": "templates"
                    }, {
                        match: 'betting-api-url',
                        replacement: (env === 'QA' ? 'http://SBPMTO-BETAPP.BLE.local:4464/BettingWebApi/api' :
                            'http://srvmtphxdev03:4464/BettingWebApi/api')
                    }, {
                        match: 'proxy-api-url',
                        replacement: (env === 'Mobile' ? 'http://localhost:8081' :
                            env === 'QA' ? 'http://api.sportsbook.betsson.sitestack.local' :
                            env === 'Test' ? 'http://api.sportsbook.betsson.sitestack.test' :
                            'http://api.sportsbook.betsson.sitestack.test')
                    }, {
                        match: 'isa-api-url',
                        replacement: (env === 'QA' || env === "DevProd" ? 'https://sbsitefacade.qasb.betsson.local/isa-ss/v2' :
                            'https://sbsitefacade.bpsgameserver.com/isa/v2')
                    }, {
                        match: 'customer-api-url',
                        replacement: (env === 'QA' ? 'https://customerapi.bpsgameserver.com/CustomerApi/api' :
                            'http://srvmtphxdev03:4466/CustomerApi/api')
                    }, {
                        match: 'favorites-api-url',
                        replacement: 'https://srvmtphxdev03:4436/CustomerFavoritesApi/api'
                    }, {
                        match: 'statistics-api-url',
                        replacement: (env === 'QA' ? 'http://sc.score24.com/scorecenter/api/stats' :
                            'http://dev.score24.com/scorecenter/api/stats')
                    }, {
                        match: 'scripts.app',
                        replacement: "scripts here"
                    }, {
                        match: 'scripts.vendor',
                        replacement: "vendor scripts here"
                    }, {
                        match: 'styles.app',
                        replacement: "css goes here"
                    }, {
                        match: 'styles.vendor',
                        replacement: "vendor css goes here"
                    }, {
                        match: 'liveLobby',
                        replacement: 'https://sportsbooklive.betssoncom.local/en/#/event/'
                    }, {
                        match: 'footballOverUnderAlias',
                        replacement: "5,4300"
                    }, {
                        match: 'footballHandicapAlias',
                        replacement: (env === 'QA' ? '4331,4328,4326,4324,4322,4063,4062,4061,4060,4059,4058,4057,4056,4055,4054,4323,4325,4327,4330,4332' : '3812,3813,3814,3815,3816,3817,3818,3819')
                    }] //, {
                    //    match: 'buildFolder',
                    //    replacement: isQaOrTest() ? '' : 'build'
                    //}]
            },
            files: [{
                flatten: true,
                src: ['<%= paths.scripts %>/base/application.base.js'],
                dest: '<%= paths.temp %>/compiled/demo/application.base.js'
            }, {
                flatten: true,
                src: ['<%= paths.scripts %>/base/routes.configuration.js'],
                dest: '<%= paths.temp %>/compiled/demo/routes.configuration.js'
            }, {
                flatten: true,
                src: ['<%= paths.scripts %>/base/constants.configuration.js'],
                dest: '<%= paths.temp %>/compiled/demo/constants.configuration.js'
            }, {
                flatten: true,
                src: ['<%= paths.scripts %>/base/i18n.configuration.js'],
                dest: '<%= paths.temp %>/compiled/demo/i18n.configuration.js'
            }]
        }
    };

    function isQaOrTest() {
        var environment = (env || '').toLowerCase();
        return environment === 'qa' || environment === 'test';
    }
};
