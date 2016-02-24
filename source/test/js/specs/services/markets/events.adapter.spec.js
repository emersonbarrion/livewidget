
describe("Adapter: Events", function () {
    "use strict";

    var adapter;

    beforeEach(module("sportsbook.markets"));
    beforeEach(module("sportsbook.configuration"));
    beforeEach(module("sportsbook.models"));

    beforeEach(inject(["eventsAdapter", function (eventsAdapter) {
        adapter = eventsAdapter;
    }]));

    it("Should convert selections", function () {

        var selectionResponseModel = [{
            "msi": 1,
            "mst": "a",
            "msp": 1.0,
            "so": 1
        }, {
            "msi": 2,
            "mst": "b",
            "msp": 1.5,
            "so": 2
        }];

        var parent = {
            "id": 1,
            "eventId": 1,
            "betGroup": {
                "id": 1
            }
        };

        var convertedModel = adapter.toSelection(parent, selectionResponseModel);

        expect(convertedModel.length).toBe(2);

        for (var i = 0; i < convertedModel.length; i++) {
            var source = selectionResponseModel[i];
            var conversion = convertedModel[i];

            expect(conversion.id).toBe(source.msi);
            expect(conversion.name).toBe(source.mst);
            expect(conversion.odds).toBe(source.msp);
            expect(conversion.sortOrder).toBe(source.so);
            expect(conversion.marketId).toBe(1);
            expect(conversion.eventId).toBe(1);
            expect(conversion.betGroupId).toBe(1);
        }
    });

    it("Should convert streams", function () {

        var response = [{
            "st": 1,
            "sp": 2,
            "si": 1,
            "su": "test",
            "sa": 1,
            "ra": 1
        }, {
            "st": 2,
            "sp": 3,
            "si": 1,
            "su": "test 2",
            "sa": 1,
            "ra": 2
        }];

        var parent = {
            "id": 1
        };

        var convertedModel = adapter.toStreamDefinition(parent, response);

        expect(convertedModel.length).toBe(2);

        for (var i = 0; i < convertedModel.length; i++) {
            var source = response[i];
            var conversion = convertedModel[i];

            expect(conversion.type).toBe(source.st);
            expect(conversion.provider).toBe(source.sp);
            expect(conversion.id).toBe(source.si);
            expect(conversion.url).toBe(source.su);
            expect(conversion.availability).toBe(source.sa);
            expect(conversion.requireAuthentication).toBe(source.ra === 1);


            expect(conversion.event).toBeDefined();
            expect(conversion.event.id).toBe(1);
        };
    });

    it("Should convert participant information", function () {

        var response = [{
            "pi": 1,
            "so": 1,
            "sl": [{
                "st": 1,
                "sp": 2,
                "si": 3
            }, {
                "st": 3,
                "sp": 3,
                "si": 22
            }]
        }, {
            "pi": 2,
            "so": 2,
            "sl": [{
                "st": 3,
                "sp": 3,
                "si": 9
            }]
        }, {
            "pi": 3,
            "so": 3
        }];

        var externalIds = [22, 9, null];

        var parent = {
            "id": 1
        };

        var convertedModel = adapter.toParticipant(parent, response);

        expect(convertedModel.length).toBe(3);

        for (var i = 0; i < convertedModel.length; i++) {
            var source = response[i];
            var conversion = convertedModel[i];

            expect(conversion.id).toBe(source.pi);
            expect(conversion.sortOrder).toBe(source.so);
            expect(conversion.externalId).toBe(externalIds[i]);

            if (source.streams) {
                expect(conversion.streams.length).toBe(source.streams.length);
            }

            expect(conversion.event).toBeDefined();
            expect(conversion.event.id).toBe(1);
        };
    });

    it("should convert markets", function () {

        var response = [{
            "mi": 4965629,
            "mn": "Match Winner",
            "dd": "2015-09-10T05:52:00Z",
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
                "msi": 18406917,
                "mst": "1",
                "msp": 2,
                "so": 1
            }, {
                "msi": 18406918,
                "mst": "X",
                "msp": 2,
                "so": 2
            }, {
                "msi": 18406919,
                "mst": "2",
                "msp": 9,
                "so": 3
            }],
            "ms": 10,
            "iel": true
        }, {
            "mi": 4965630,
            "mn": "Half time",
            "dd": "2015-09-10T05:52:00Z",
            "ht": null,
            "bgi": 258,
            "bgn": "Half time",
            "bgd": "",
            "bgti": 34,
            "bgtci": 5,
            "bggi": 0,
            "bggn": null,
            "cri": 1,
            "lv": "",
            "msl": [{
                "msi": 18406920,
                "mst": "1",
                "msp": 2,
                "so": 1
            }, {
                "msi": 18406921,
                "mst": "X",
                "msp": 3,
                "so": 2
            }, {
                "msi": 18406922,
                "mst": "2",
                "msp": 3.6,
                "so": 3
            }],
            "ms": 10,
            "iel": true
        }, {
            "mi": 4965659,
            "mn": "Over Under Corners",
            "dd": "2015-09-10T05:52:00Z",
            "ht": null,
            "bgi": 2144,
            "bgn": "Over Under Corners",
            "bgd": "",
            "bgti": 1612,
            "bgtci": 15,
            "bggi": 0,
            "bggn": null,
            "cri": 1,
            "lv": "8",
            "msl": [{
                "msi": 18407054,
                "mst": "Over 8.0",
                "msp": 5,
                "so": 1
            }, {
                "msi": 18407055,
                "mst": "Under 8.0",
                "msp": 1.14,
                "so": 2
            }],
            "ms": 20,
            "iel": false
        }];

        var parent = {
            "id": 1,
            "category": {
                "id": 2
            },
            "region": {
                "id": 3
            },
            "subCategory": {
                "id": 4
            }
        };

        var convertedModel = adapter.toMarket(parent, response);

        expect(convertedModel.length).toBe(3);

        expect(convertedModel[0].id).toBe(4965629);
        expect(convertedModel[0].name).toEqual("Match Winner");
        expect(convertedModel[0].status).toBe(10);
        expect(convertedModel[0].isOnHold).toBe(false);

        expect(convertedModel[1].id).toBe(4965630);
        expect(convertedModel[1].name).toEqual("Half time");
        expect(convertedModel[1].status).toBe(10);
        expect(convertedModel[1].isOnHold).toBe(false);

        expect(convertedModel[2].id).toBe(4965659);
        expect(convertedModel[2].name).toEqual("Over Under Corners");
        expect(convertedModel[2].status).toBe(20);
        expect(convertedModel[2].isOnHold).toBe(true);

    });
});
