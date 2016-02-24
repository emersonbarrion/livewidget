describe("Viewmodel Adapter: Events Table By Competition", function () {
    var d;

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["eventTableViewModelAdapterByCompetition", "applicationState", "$q", "$rootScope", "betGroupsResource", function (eventTableViewModelAdapterByCompetition, applicationState, $q, $rootScope, betGroupsResource) {
        d = {};

        d.service = eventTableViewModelAdapterByCompetition;
        d.betGroups = betGroupsResource;
        d.root = $rootScope;
        d.q = $q;
    }]));

    it("Should return the sort order for the given headers", function () {

        // Return an empty array if no betgroups are specified.
        expect(d.service._getHeaderSortOrder({
            "betGroups": undefined
        }).length).toBe(0);

        var result = d.service._getHeaderSortOrder({
            "betGroups": [53, 83, 821]
        });
        expect(result.length).toBe(3);
        expect(result[0].id).toBe(53);
        expect(result[0].index).toBe(0);
        expect(result[1].id).toBe(83);
        expect(result[1].index).toBe(1);
        expect(result[2].id).toBe(821);
        expect(result[2].index).toBe(2);
    });

    it("Should return headers based on the given bet groups", function () {

        var args = {
            "culture": {
                "id": 601,
                "languageCode": "en"
            },
            "betGroups": [1, 2, 3],
            "events": [{
                getMarkets: function () {
                    return [{
                        "betGroup": {
                            "id": 1,
                            "name": "test"
                        },
                        "lineValue": "0 - 2.0",
                        getSelections: function () {
                            return [{
                                "name": "a",
                                "sortOrder": 1
                            }];
                        },
                        selections: [{
                            "name": "a",
                            "sortOrder": 1
                        }]
                    }, {
                        "betGroup": {
                            "id": 3,
                            "name": "test 2"
                        },
                        getSelections: function () {
                            return [{
                                "name": "b",
                                "sortOrder": 1
                            }, {
                                "name": "c",
                                "sortOrder": 1
                            }];
                        },
                        selections: [{
                            "name": "b",
                            "sortOrder": 1
                        }, {
                            "name": "c",
                            "sortOrder": 1
                        }]
                    }];
                }
            }]
        };

        spyOn(d.service, "_getHeaderSortOrder").and.returnValue([{
            "id": 1,
            "index": 0
        }, {
            "id": 3,
            "index": 1
        }, {
            "id": 2,
            "index": 2
        }]);


        d.service._getHeadersForEvents(args);
        expect(d.service._getHeaderSortOrder).toHaveBeenCalledWith({
            "betGroups": args.betGroups
        });

        d.root.$apply();
    });
});
