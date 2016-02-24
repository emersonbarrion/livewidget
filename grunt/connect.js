var rewrite = require("connect-modrewrite");
var grunt = require("grunt");

module.exports = {
    default: {
        options: {
            port: 9001,
            hostname: "sportsbook.betsson.sitestack.mylocal",
            base: "./build",
            keepalive: true,
            middleware: function (connect, options, middlewares) {

                // the rules that shape our mod-rewrite behavior
                var rules = [
                    "docs$ docs/index.html#/api [R]",
                    "docs/(.*)$ reports/docs/$1",
                    "test/run test-runner.html",
                    "test/coverage$ test/coverage/index.html [R]",
                    "test/coverage/(.*)$ /build/reports/coverage/$1",
                    "^[^\\.]*$ /index.html [L]"
                ];

                // add rewrite as first item in the chain of middlewares
                middlewares.unshift(rewrite(rules));

                return middlewares;
            }
        }
    }
};