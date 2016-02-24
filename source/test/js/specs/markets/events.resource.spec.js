describe("Resource: Events", function () {

    var eventsResource, $httpBackend, sportsbookConfiguration, eventsGet, prematchSession, $q;

    beforeEach(module("sportsbook.markets", ["sportsbookConfigurationProvider", function (sportsbookConfigurationProvider) {
        sportsbookConfigurationProvider.config = {
            categoryMappingSource: "/js/config/category-mappings.js",
            services: {
                isaUrl: "http://www.test.com"
            }
        };
    }]));
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get("$httpBackend");

        $httpBackend.when("GET", "/js/config/category-mappings.js").respond(﻿{
            "1": {
                "name": "football",
                "iconHint": "football"
            }
        });
    }));
    beforeEach(inject(function ($injector) {
        eventsResource = $injector.get("eventsResource");
        prematchSession = $injector.get("prematchSession");
        $q = $injector.get("$q");
        spyOn(prematchSession, "getSessionInfo").and.returnValue($q.when({
            "segmentId": 601,
            "token": "TEST_TOKEN"
        }));
        eventsGet = $httpBackend.when("GET", "http://www.test.com/601/en/event");
    }));

    it("should correctly return a list of events for a successful response", function (done) {

        eventsGet.respond({
            "tec": 287,
            "tp": 29,
            "pn": 1,
            "el": [{
                "ei": 663731,
                "en": "Marigold Court1 - Marigold Court2",
                "il": true,
                "sd": "2015-02-16T22:21:00Z",
                "cep": 2,
                "et": 1,
                "ci": 1,
                "cn": "Football",
                "ri": 0,
                "rn": null,
                "sci": 2024,
                "scn": "Spanish Segunda B",
                "sr": {
                    "pbbpoe": 0,
                    "dso": 0
                },
                "epl": [{
                    "pi": 154338,
                    "so": 1,
                    "sl": []
                }, {
                    "pi": 154339,
                    "so": 2,
                    "sl": []
                }],
                "mc": 1,
                "ml": [{
                    "mi": 4920235,
                    "mn": "Match Winner",
                    "dd": "2015-02-16T22:21:00Z",
                    "ht": null,
                    "bgi": 257,
                    "bgn": "Match Winner",
                    "bgd": "",
                    "bgti": 33,
                    "bgtci": 5,
                    "bggi": 0,
                    "bggn": null,
                    "cri": 1,
                    "lv": "",
                    "msl": [{
                        "msi": 18252951,
                        "mst": "1",
                        "msp": 1.2,
                        "so": 1
                    }, {
                        "msi": 18252952,
                        "mst": "X",
                        "msp": 1.3,
                        "so": 2
                    }, {
                        "msi": 18252953,
                        "mst": "2",
                        "msp": 2.3,
                        "so": 3
                    }],
                    "ms": 10,
                    "iel": true
                }],
                "sl": [],
                "sb": null
            }, {
                "ei": 663955,
                "en": "TestEvent2A - TestEvent2B",
                "il": true,
                "sd": "2015-02-17T01:29:00Z",
                "cep": 2,
                "et": 1,
                "ci": 1,
                "cn": "Football",
                "ri": 0,
                "rn": null,
                "sci": 6254,
                "scn": "Spain Segunda Division - Promotion Playoffs",
                "sr": {
                    "pbbpoe": 0,
                    "dso": 0
                },
                "epl": [{
                    "pi": 154442,
                    "so": 1,
                    "sl": []
                }, {
                    "pi": 154443,
                    "so": 2,
                    "sl": []
                }],
                "mc": 2,
                "ml": [{
                    "mi": 4924869,
                    "mn": "Match Winner",
                    "dd": "2015-02-17T01:29:00Z",
                    "ht": null,
                    "bgi": 257,
                    "bgn": "Match Winner",
                    "bgd": "",
                    "bgti": 33,
                    "bgtci": 5,
                    "bggi": 0,
                    "bggn": null,
                    "cri": 1,
                    "lv": "",
                    "msl": [{
                        "msi": 18266923,
                        "mst": "1",
                        "msp": 1,
                        "so": 1
                    }, {
                        "msi": 18266924,
                        "mst": "X",
                        "msp": 1,
                        "so": 2
                    }, {
                        "msi": 18266925,
                        "mst": "2",
                        "msp": 1,
                        "so": 3
                    }],
                    "ms": 10,
                    "iel": true
                }, {
                    "mi": 4927965,
                    "mn": "1st Half Goals",
                    "dd": "2015-02-17T01:29:00Z",
                    "ht": null,
                    "bgi": 2136,
                    "bgn": "1st Half Goals",
                    "bgd": "",
                    "bgti": 1600,
                    "bgtci": 15,
                    "bggi": 0,
                    "bggn": null,
                    "cri": 1,
                    "lv": "1",
                    "msl": [{
                        "msi": 18276086,
                        "mst": null,
                        "msp": 1.05,
                        "so": 1
                    }, {
                        "msi": 18276087,
                        "mst": null,
                        "msp": 8,
                        "so": 2
                    }],
                    "ms": 10,
                    "iel": true
                }],
                "sl": [],
                "sb": null
            }, {
                "ei": 663996,
                "en": "Football Team One - Football Team Two",
                "il": true,
                "sd": "2015-02-18T07:28:00Z",
                "cep": 2,
                "et": 1,
                "ci": 1,
                "cn": "Football",
                "ri": 0,
                "rn": null,
                "sci": 677,
                "scn": "Catalunya Cup",
                "sr": {
                    "pbbpoe": 0,
                    "dso": 0
                },
                "epl": [{
                    "pi": 145649,
                    "so": 1,
                    "sl": []
                }, {
                    "pi": 145650,
                    "so": 2,
                    "sl": []
                }],
                "mc": 1,
                "ml": [{
                    "mi": 4926237,
                    "mn": "Match Winner",
                    "dd": "2015-02-18T07:28:00Z",
                    "ht": null,
                    "bgi": 257,
                    "bgn": "Match Winner",
                    "bgd": "",
                    "bgti": 33,
                    "bgtci": 5,
                    "bggi": 0,
                    "bggn": null,
                    "cri": 1,
                    "lv": "",
                    "msl": [{
                        "msi": 18268985,
                        "mst": "1",
                        "msp": 1,
                        "so": 1
                    }, {
                        "msi": 18268986,
                        "mst": "X",
                        "msp": 1,
                        "so": 2
                    }, {
                        "msi": 18268987,
                        "mst": "2",
                        "msp": 1,
                        "so": 3
                    }],
                    "ms": 10,
                    "iel": true
                }],
                "sl": [],
                "sb": null
            }]
        });


        eventsResource.query({}, {
            languageCode: 'en'
        }, true).then(function (events) {
            expect(events.length).toBe(3);
            done();
        });

        $httpBackend.flush();

    });

})﻿;
