
(function (angular) {
    "use strict";

    var MockApiResponseFactory = function (moment) {
        // constructor
        this.moment = moment;
    };

    MockApiResponseFactory.$inject = ["moment"];

    var getDefaultListOptions = function (options) {
        options = options || {};

        options = _.defaults(options, {
            "howMany": 1,
            "ids": [],
            "override": {}
        });

        if (_.isEmpty(options.ids)) {
            // Automatic IDs
            options.ids = _.times(options.howMany, function (n) {
                return n + 1;
            });
        }

        return options;
    };

    MockApiResponseFactory.prototype.getCategories = function () {
        throw new Error("Not implemented yet.");
    };

    MockApiResponseFactory.prototype.getCategory = function (override, options) {
        override = override || {};
        options = options || {};

        options = _.defaults(options, {
            "withChildren": false
        });

        var defaultCategory = {
            "ci": 1,
            "cn": "Test Category",
            "rl": [this.getRegion({}, options)],
            "scl": [], // Leave empty!
            "mc": 0,
            "sr": {
                "pbbpoe": 0,
                "dso": 9999
            }
        };

        return _.defaultsDeep(override, defaultCategory);
    };

    MockApiResponseFactory.prototype.getRegion = function (override, options) {
        override = override || {};
        options = options || {};

        options = _.defaults(options, {
            "withChildren": false
        });

        var defaultRegion = {
            "ri": 11,
            "rn": "Test Region",
            "scl": [this.getSubCategory({}, options)],
            "mc": 0,
            "sr": {
                "pbbpoe": 0,
                "dso": 9999
            }
        };

        return _.defaultsDeep(override, defaultRegion);
    };

    MockApiResponseFactory.prototype.getSubCategory = function (override, options) {
        override = override || {};
        options = options || {};

        var defaultSubCategory = {
            "sci": 111,
            "scn": "Test Sub Category",
            "el": this.getCompactEvents({
                ids: [1],
                howMany: 1
            }),
            "mc": 0,
            "sr": {
                "pbbpoe": 0,
                "dso": 9999
            },
            "sl": []
        };

        return _.defaultsDeep(override, defaultSubCategory);
    };

    MockApiResponseFactory.prototype.getSearchResult = function (override, options) {
        override = override || {};
        options = options || {};

        var defaultSearchResults = {
            "sm": "testSearchTerm",
            "ci": 1,
            "cn": "Test Category",
            "el": this.getSearchResultEvents({
                ids: [1],
                howMany: 1
            })
        };

        return _.defaultsDeep(override, defaultSearchResults);
    };

    MockApiResponseFactory.prototype.getSearchResultEvents = function (options) {
        options = getDefaultListOptions(options);

        var searchResultEvents = _.times(options.howMany, function (n) {
            return {
                "ei": options.ids[n]
            };
        }, this);

        return searchResultEvents;
    };

    MockApiResponseFactory.prototype.getCompactEvents = function (options) {
        options = getDefaultListOptions(options);

        var compactEvents = _.times(options.howMany, function (n) {
            var override = _.defaults(options.override, {
                "ei": options.ids[n]
            });
            return this.getCompactEvent(override);
        }, this);

        return compactEvents;
    };

    MockApiResponseFactory.prototype.getCompactEvent = function (override, options) {
        override = override || {};
        options = options || {};

        options = _.defaults(options, {
            "startsInHours": _.random(24 * 7) // random time within a week
        });

        var startDate = moment().add(options.startsInHours, "hours");

        var defaultCompactEvent = {
            "ei": 1,
            "sd": startDate.format(),
            "mc": 0,
            "cep": 1
        };

        return _.defaults(override, defaultCompactEvent);
    };

    MockApiResponseFactory.prototype.getEvents = function (options) {
        options = getDefaultListOptions(options);

        var events = _.times(options.howMany, function (n) {
            var override = _.defaults(options.override, {
                "ei": options.ids[n]
            });
            return this.getEvent(override);
        }, this);

        return events;
    };

    MockApiResponseFactory.prototype.getEvent = function (override, options) {
        override = override || {};
        options = options || {};

        options = _.defaults(options, {
            "startsInHours": _.random(24 * 7) // random time within a week
        });

        var startDate = moment().add(options.startsInHours, "hours");

        var defaultEvent = {
            "ei": 1, // event ID
            "en": "Test Event", // event name
            "il": true, // will be available to bet on when live
            "sd": startDate.format(), // start date/time
            "cep": 1, // current event phase
            "et": 1, // event type (1 - match, 2 - winner list)
            "ci": 1, // category ID
            "cn": "Test Category", // category name
            "ri": 11, // region ID
            "rn": "Test Region", // region name
            "sci": 111, // sub category ID
            "scn": "Test Sub Category", // sub category name
            "sr": { // sorting rank
                "pbbpoe": 0, // popularity by bets placed on event
                "dso": 0 // default sort order
            },
            "epl": this.getParticipants(), // event participant list
            "mc": 0, // market count
            "ml": [
                this.getMarket() //Initialise with default market.
            ], // market list
            "sl": [], // stream list
            "ss": null, // no clue what this is ???
            "sb": null // scoreboard
        };

        return _.defaultsDeep(override, defaultEvent);
    };

    MockApiResponseFactory.prototype.getParticipants = function (options) {
        options = options || {};

        return [{
            "pi": 1, // participant ID
            "so": 1, // sort order
            "sl": [] // participant stream list
        }, {
            "pi": 2,
            "so": 2,
            "sl": []
        }];
    };

    MockApiResponseFactory.prototype.getMarkets = function (options) {
        options = getDefaultListOptions(options);

        var markets = _.times(options.howMany, function (n) {
            var override = _.defaults(options.override, {
                "mi": options.ids[n]
            });
            return this.getMarket(override);
        }, this);

        return markets;
    };

    MockApiResponseFactory.prototype.getMarket = function (override, options) {
        override = override || {};

        var defaultMarket = {
            "mi": 1,
            "mn": "Test Market",
            "dd": "2015-09-09T09:55:00Z",
            "ht": "",
            "bgi": 1,
            "bgn": "Test BetGroup",
            "bgd": "",
            "bgti": 1,
            "bgtci": 1,
            "bggi": 0,
            "bggn": "",
            "cri": 1,
            "lv": "",
            "msl": [
                this.getSelection()
            ],
            "ms": 10,
            "iel": true
        };

        return _.defaultsDeep(override, defaultMarket);
    };

    MockApiResponseFactory.prototype.getSelections = function (options) {
        options = getDefaultListOptions(options);

        var selections = _.times(options.howMany, function (n) {
            var override = _.defaults(options.override, {
                "msi": options.ids[n]
            });
            return this.getSelection(override);
        }, this);

        return selections;
    };

    MockApiResponseFactory.prototype.getSelection = function (override) {
        override = override || {};

        var defaultSelection = {
            "msi": 1,
            "mst": "1",
            "msp": 1.90,
            "so": 1,
            "pi": 0
        };

        return _.defaults(override, defaultSelection);
    };

    MockApiResponseFactory.prototype.getScoreboard = function (override, options) {
        override = override || {};
        options = options || {};

        var defaultScoreboard = {
            "pl": [{
                "pi": 1,
                "pn": "Test Participant 1",
                "so": 1
            }, {
                "pi": 2,
                "pn": "Test Participant 2",
                "so": 2
            }],
            "gal": [],
            "gsl": [{
                "gpi": 15,
                "gpn": "",
                "sti": 12,
                "spi": 155598,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 7,
                "spi": 155598,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 2,
                "spi": 89170,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 3,
                "spi": 155598,
                "v": "1"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 1,
                "spi": 89170,
                "v": "1"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 3,
                "spi": 89170,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 1,
                "spi": 155598,
                "v": "2"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 2,
                "spi": 155598,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 12,
                "spi": 89170,
                "v": "0"
            }, {
                "gpi": 15,
                "gpn": "",
                "sti": 7,
                "spi": 89170,
                "v": "0"
            }],
            "gcp": {
                "gpi": 4,
                "gpn": "2nd half Overtime"
            },
            "gmc": {
                "s": 0,
                "m": 105,
                "mcm": 3,
                "lu": "2015-09-09T11:53:30.6625657Z"
            }
        };

        return _.defaults(override, defaultScoreboard);
    };

    MockApiResponseFactory.prototype.getBettingApiCouponPlacementSuccessResponse = function (override) {
        override = override || {};

        var defaultSuccessResponse = {
            "isSuccess": true,
            "errorCode": 0,
            "referenceId": "6a953972-92cf-4f7e-b15b-b8a121faee78"
        };

        return _.defaults(override, defaultSuccessResponse);
    };

    MockApiResponseFactory.prototype.getBettingApiCouponPlacementFailedResponse = function (override) {
        override = override || {};

        var defaultErrorResponse = {
            "isSuccess": false,
            "errorCode": -1,
            "referenceId": "6a953972-92cf-4f7e-b15b-b8a121faee78"
        };

        return _.defaults(override, defaultErrorResponse);
    };

    MockApiResponseFactory.prototype.getBettingApiCouponStatusSuccessResponse = function (override) {
        override = override || {};

        var defaultSuccessResponse = {
            "couponID": "1234443",
            "couponArrivedDate": "01/20/2015 13:37:02",
            "status": "Success"
        };

        return _.defaults(override, defaultSuccessResponse);
    };

    MockApiResponseFactory.prototype.getBettingApiCouponStatusFailedResponse = function (override) {
        override = override || {};

        var defaultErrorResponse = {
            "couponID": "1234443",
            "couponArrivedDate": "01/20/2015 13:37:02",
            "status": "Failed",
            "errors": [{
                "errorCode": "-1"
            }]
        };

        return _.defaults(override, defaultErrorResponse);
    };



    angular
        .module("sportsbook.tests")
        .service("mockApiResponseFactory", MockApiResponseFactory);

})(window.angular);

/*
{
    "ei": 667120,
    "en": "Ian - Eljero Elia",
    "il": true,
    "sd": "2015-09-09T09:55:00Z",
    "cep": 2,
    "et": 1,
    "ci": 1,
    "cn": "Football",
    "ri": 1,
    "rn": "International",
    "sci": 4403,
    "scn": "Russia 2 Centre",
    "sr": {
        "pbbpoe": 0,
        "dso": 0
    },
    "epl": [{
        "pi": 155598,
        "so": 1,
        "sl": []
    }, {
        "pi": 89170,
        "so": 2,
        "sl": []
    }],
    "mc": 1,
    "ml": [{
        "mi": 4965558,
        "mn": "Match Winner",
        "dd": "2015-09-09T09:55:00Z",
        "ht": "",
        "bgi": 257,
        "bgn": "Match Winner",
        "bgd": "",
        "bgti": 33,
        "bgtci": 5,
        "bggi": 0,
        "bggn": "",
        "cri": 1,
        "lv": "",
        "msl": [{
            "msi": 18406613,
            "mst": "1",
            "msp": 2,
            "so": 1,
            "pi": 0
        }, {
            "msi": 18406614,
            "mst": "X",
            "msp": 2,
            "so": 2,
            "pi": 0
        }, {
            "msi": 18406615,
            "mst": "2",
            "msp": 9,
            "so": 3,
            "pi": 0
        }],
        "ms": 10,
        "iel": true
    }],
    "sl": [],
    "ss": null,
    "sb": {
        "ei": 667120,
        "ci": 1,
        "pl": [{
            "pi": 155598,
            "pn": "Ian",
            "so": 1
        }, {
            "pi": 89170,
            "pn": "Eljero Elia",
            "so": 2
        }],
        "gal": [],
        "gsl": [{
            "gpi": 15,
            "gpn": "",
            "sti": 12,
            "spi": 155598,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 7,
            "spi": 155598,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 2,
            "spi": 89170,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 3,
            "spi": 155598,
            "v": "1"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 1,
            "spi": 89170,
            "v": "1"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 3,
            "spi": 89170,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 1,
            "spi": 155598,
            "v": "2"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 2,
            "spi": 155598,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 12,
            "spi": 89170,
            "v": "0"
        }, {
            "gpi": 15,
            "gpn": "",
            "sti": 7,
            "spi": 89170,
            "v": "0"
        }],
        "gcp": {
            "gpi": 4,
            "gpn": "2nd half Overtime"
        },
        "gmc": {
            "s": 0,
            "m": 105,
            "mcm": 3,
            "lu": "2015-09-09T11:53:30.6625657Z"
        }
    }
}
*/