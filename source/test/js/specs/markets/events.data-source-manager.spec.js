describe("Service: Events Data Source Manager", function () {
    var service, resource, $q, $rootScope;

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["eventDataSourceManager", "applicationState", "eventsResource", "$rootScope", "$q", function (eventDataSourceManager, applicationState, eventsResource, _$rootScope_, _$q_) {
        service = eventDataSourceManager;
        resource = eventsResource;
        $rootScope = _$rootScope_;
        $q = _$q_;

        spyOn(applicationState, "culture").and.returnValue($q.when({
            id: 601,
            languageCode: "en"
        }));
    }]));

    describe("data updates", function () {
        var serverEvents, mockDataSourceFunction;

        beforeEach(function() {
            serverEvents = [{
                id: 1,
                markets: [
                    { id: 1, name: "a", betGroup: { name: "a" }, selections: [{ id: 1, odds: 1.0 }, { id: 2, odds: 2.0 }] },
                    { id: 2, name: "a", betGroup: { name: "a" }, selections: [{ id: 1, odds: 1.0 }, { id: 2, odds: 2.0 }] }
                ]
            }];

            mockDataSourceFunction = function () {
                return angular.copy(serverEvents);
            };
        });

        it("should notify data sources which have new events and markets.", function (done) {

            service.createMockDataSource("pageData", mockDataSourceFunction).then(function (dataSource) {

                spyOn(dataSource, "processNewEvents");
                spyOn(dataSource, "processNewMarkets");
                spyOn($rootScope, "$broadcast");

                var newEvent = {
                    id: 2,
                    markets: [
                        { id: 3, name: "a", betGroup: { name: "a"}, selections: [{ id: 1, odds: 1.0 }, { id: 2, odds: 2.0 }] }
                    ]
                };

                serverEvents.push(newEvent);

                service.reloadAll().then(function () {
                    var newEventsData = [
                        jasmine.objectContaining({ id: 2 })
                    ];

                    var newMarketsData = [
                        jasmine.objectContaining({
                            id: 3,
                            selections: [
                                jasmine.objectContaining({ id: 1, odds: 1.0 }),
                                jasmine.objectContaining({ id: 2, odds: 2.0 })
                            ]
                        })
                    ];

                    expect(dataSource.processNewEvents).toHaveBeenCalledWith(newEventsData);
                    expect(dataSource.processNewMarkets).toHaveBeenCalledWith(newMarketsData);

                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-added", newEventsData);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-markets-added", newMarketsData);

                    done();
                });

            });

            $rootScope.$digest();
        });

        it("should notify data sources which have deleted events and markets.", function (done) {
            service.createMockDataSource("pageData", mockDataSourceFunction).then(function (dataSource) {

                spyOn(dataSource, "processDeletedEvents");
                spyOn(dataSource, "processDeletedMarkets");
                spyOn($rootScope, "$broadcast");

                serverEvents.pop();

                service.reloadAll().then(function () {
                    var deletedEventsData = [
                        jasmine.objectContaining({ id: 1 })
                    ];
                    var deletedMarketsData = [
                        jasmine.objectContaining({
                            id: 1,
                            selections: [
                                jasmine.objectContaining({ id: 1, odds: 1.0 }),
                                jasmine.objectContaining({ id: 2, odds: 2.0 }),
                            ]
                        }),
                        jasmine.objectContaining({
                            id: 2,
                            selections: [
                                jasmine.objectContaining({ id: 1, odds: 1.0 }),
                                jasmine.objectContaining({ id: 2, odds: 2.0 }),
                            ]
                        })
                    ];

                    expect(dataSource.processDeletedEvents).toHaveBeenCalledWith(deletedEventsData);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-deleted", deletedEventsData);

                    expect(dataSource.processDeletedMarkets).toHaveBeenCalledWith(deletedMarketsData);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-markets-deleted", deletedMarketsData);

                    done();
                });

            });

            $rootScope.$digest();
        });

        it("should notify data sources with updated markets and odds.", function (done) {
            service.createMockDataSource("pageData", mockDataSourceFunction).then(function (dataSource) {

                spyOn(dataSource, "processNewMarkets");
                spyOn(dataSource, "processUpdatedMarkets");
                spyOn($rootScope, "$broadcast");

                var newMarket = { id: 3, name: "a", betGroup: { name: "a" }, selections: [{ id: 1, odds: 1.0 }] };

                serverEvents[0] = {
                    id: 1,
                    markets: [
                        { id: 1, name: "a", betGroup: { name: "a" }, oddsChange: true, holdStatusChange: false, selections: [{ id: 1, odds: 3.0, oddsChange: true, holdStatusChange: false }, { id: 2, odds: 4.0, oddsChange: true, holdStatusChange: false }] },
                        newMarket
                    ]
                };

                service.reloadAll().then(function () {
                    var newMarketsData = [
                        jasmine.objectContaining({ id: newMarket.id })
                    ];
                    var updatedMarketsData = [
                        jasmine.objectContaining({
                            id: 1,
                            selectionDiffsById: {
                                1: {
                                    id: 1,
                                    oldOdds: 1.0, newOdds: 3.0, oddsChange: true, holdStatusChange: false
                                },
                                2: {
                                    id: 2,
                                    oldOdds: 2.0, newOdds: 4.0, oddsChange: true, holdStatusChange: false
                                }
                            },
                            oddsChange: true,
                            holdStatusChange: false
                        })
                    ];

                    expect(dataSource.processNewMarkets).toHaveBeenCalledWith(newMarketsData);
                    expect(dataSource.processUpdatedMarkets).toHaveBeenCalledWith(updatedMarketsData);

                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-markets-added", newMarketsData);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith("pageData-markets-updated", updatedMarketsData);

                    done();
                });

            });

            $rootScope.$digest();
        });
    });

    it("should sync all the data from the different event sources.", function (done) {

        var serverEventsA = [{
            id: 1,
            markets: []
        }];

        var serverEventsB = [{
            id: 2,
            markets: []
        }];

        service.createMockDataSource("dataSourceA", function () { return serverEventsA; }).then(function () {

            service.createMockDataSource("dataSourceB", function () { return serverEventsB; }).then(function () {
                serverEventsA.push({
                    id: 3,
                    markets: []
                });

                serverEventsB.push({
                    id: 4,
                    markets: []
                });

                service.reloadAll().then(function () {
                    expect(service.getAllEvents()).toEqual([
                        jasmine.objectContaining({ id: 1 }),
                        jasmine.objectContaining({ id: 2 }),
                        jasmine.objectContaining({ id: 3 }),
                        jasmine.objectContaining({ id: 4 }),
                    ]);

                    done();
                });

            });

        });

        $rootScope.$digest();
    });


    it("should sync only updates from the last data source called.", function (done) {

        var serverEventsA = [{
            id: 1,
            markets: [
                {
                    id: 1,
                    name: "a",
                    betGroup: {
                        name: "a"
                    },
                    selections: [{ id: 1, odds: 1.0 }]
                }
            ]
        }];

        var serverEventsB = [{
            id: 1,
            markets: [
                {
                    id: 1,
                    name: "a",
                    betGroup: {
                        name: "a"
                    },
                    selections: [{ id: 1, odds: 1.0 }]
                }
            ]
        }];

        service.createMockDataSource("dataSourceA", function () { return serverEventsA; }).then(function (dataSourceA) {

            service.createMockDataSource("dataSourceB", function () { return serverEventsB; }).then(function (dataSourceB) {
                expect(service.getAllEvents()).toEqual([
                    jasmine.objectContaining({ id: 1 })
                ]);

                expect(service.getAllMarkets()).toEqual([
                    jasmine.objectContaining({
                        id: 1,
                        selections: [ jasmine.objectContaining({ id: 1, odds: 1.0 }) ]
                    })
                ]);

                serverEventsA[0].markets[0].selections[0].odds = 2.0;
                serverEventsB[0].markets[0].selections[0].odds = 3.0;

                service.reloadAll().then(function () {
                    expect(dataSourceA.content).toEqual(dataSourceB.content);
                    expect(service.getAllEvents()).toEqual([
                        jasmine.objectContaining({ id: 1 })
                    ]);
                    expect(service.getAllMarkets()).toEqual([
                        jasmine.objectContaining({
                            id: 1,
                            selections: [jasmine.objectContaining({ id: 1, odds: 3.0 })]
                        })
                    ]);

                    done();
                });

            });

        });

        $rootScope.$digest();
    });
});
