describe("Viewmodel Adapter: Market selection list", function () {
    var viewModelAdapter, widgetConfigurations, $q, $rootScope, testEvents, MarketModelFactory;

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["marketSelectionListViewModelAdapter", "applicationState", "widgetConfigurations", "$q", "$rootScope", "marketModelFactory", function (marketSelectionListViewModelAdapter, applicationState, _widgetConfigurations_, _$q_, _$rootScope_, _MarketModelFactory_) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        viewModelAdapter = marketSelectionListViewModelAdapter;
        widgetConfigurations = _widgetConfigurations_;

        spyOn(applicationState, "culture").and.returnValue($q.when({
            id: 601,
            languageCode: "en"
        }));

        MarketModelFactory = _MarketModelFactory_;

        testEvents = [{
            id: 1,
            category: {
                id: 1
            },
            getMarkets: function () {
                return [
                    new MarketModelFactory({
                        id: 1,
                        name: "test",
                        betGroup: {
                            id: 1
                        },
                        selections: [{
                            id: 1
                        }]
                    })
                ];
            }
        }];
    }]));

    it("should take the limit from the root if it exists", function () {
        var configuration = {
            name: "event-section",
            layout: ["large-12"],
            defaultLimit: 3,
            widgets: [{
                group: [{
                    betGroups: [1]
                }]
            }]
        };

        spyOn(widgetConfigurations, "getForSection").and.returnValue($q.when(configuration));

        viewModelAdapter.toViewModel(testEvents).then(function (viewModel) {
            expect(viewModel.small[0].widgets[0].betGroupGroupings[0].limit).toBe(3);
        });

        $rootScope.$digest();
    });

    it("should take the limit from the widget if it exists, ignoring any others on a higher level", function () {
        var configuration = {
            name: "event-section",
            layout: ["large-12"],
            defaultLimit: 3,
            widgets: [{
                defaultLimit: 2,
                group: [{
                    betGroups: [1]
                }]
            }]
        };

        spyOn(widgetConfigurations, "getForSection").and.returnValue($q.when(configuration));

        viewModelAdapter.toViewModel(testEvents).then(function (viewModel) {
            expect(viewModel.small[0].widgets[0].betGroupGroupings[0].limit).toBe(2);
        });

        $rootScope.$digest();
    });

    it("should take the limit from the betgroup if it exists, ignoring any others on a higher level", function () {
        var configuration = {
            name: "event-section",
            layout: ["large-12"],
            defaultLimit: 3,
            widgets: [{
                defaultLimit: 2,
                group: [{
                    betGroups: [1],
                    limit: 1
                }]
            }]
        };

        spyOn(widgetConfigurations, "getForSection").and.returnValue($q.when(configuration));

        viewModelAdapter.toViewModel(testEvents).then(function (viewModel) {
            expect(viewModel.small[0].widgets[0].betGroupGroupings[0].limit).toBe(1);
        });

        $rootScope.$digest();
    });

    it("should interpret any limit less than 1 to mean undefined", function () {
        var configuration = {
            name: "event-section",
            layout: ["large-12"],
            defaultLimit: 3,
            widgets: [{
                defaultLimit: 2,
                group: [{
                    betGroups: [1],
                    limit: 0
                }]
            }]
        };

        spyOn(widgetConfigurations, "getForSection").and.returnValue($q.when(configuration));

        viewModelAdapter.toViewModel(testEvents).then(function (viewModel) {
            expect(viewModel.small[0].widgets[0].betGroupGroupings[0].limit).toBeUndefined();
        });

        $rootScope.$digest();
    });

    describe("data merging", function () {

        beforeEach(function () {

            var configuration = {
                name: "event-section",
                layout: ["large-6", "large-6"],
                widgets: [{
                    group: [{
                        betGroups: [1]
                    }, {
                        betGroups: [2]
                    }]
                }, {
                    group: [{
                        betGroups: [3]
                    }]
                }]
            };

            spyOn(widgetConfigurations, "getForSection").and.returnValue($q.when(configuration));
        });

        describe("mergeNewMarkets", function () {
            var viewModel;

            beforeEach(function () {

                viewModelAdapter.toViewModel(testEvents).then(function (_viewModel_) {
                    viewModel = _viewModel_;
                });

                $rootScope.$digest();
            });

            it("should merge new markets into existing betgroup groupings if those betgroup groupings exist", function () {
                viewModelAdapter.mergeNewMarkets(viewModel, [
                    new MarketModelFactory({
                        id: 2,
                        betGroup: {
                            id: 1
                        },
                        selections: [{
                            id: 1
                        }]
                    })
                ]);

                $rootScope.$digest();

                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets.length).toBe(2);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets[1].id).toBe(2);

                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets.length).toBe(2);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets[1].id).toBe(2);
            });

            it("should merge new markets into new betgroup groupings if those betgroup groupings do not exist", function () {
                viewModelAdapter.mergeNewMarkets(viewModel, [
                    new MarketModelFactory({
                        id: 2,
                        betGroup: {
                            id: 2
                        },
                        selections: [{
                            id: 1
                        }]
                    })
                ]);

                $rootScope.$digest();

                expect(viewModel.large[0].widgets[0].betGroupGroupings.length).toBe(2);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[1].markets.length).toBe(1);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[1].markets[0].id).toBe(2);

                expect(viewModel.small[0].widgets[0].betGroupGroupings.length).toBe(2);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[1].markets.length).toBe(1);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[1].markets[0].id).toBe(2);
            });

            it("should create new widgets if these do not exist, and should place them in the proper layout group, if merging a new market requires it", function () {
                viewModelAdapter.mergeNewMarkets(viewModel, [
                    new MarketModelFactory({
                        id: 2,
                        betGroup: {
                            id: 3
                        },
                        selections: [{
                            id: 1
                        }]
                    })
                ]);

                $rootScope.$digest();

                expect(viewModel.large.length).toBe(2);
                expect(viewModel.large[0].widgets.length).toBe(1);
                expect(viewModel.large[1].widgets[0].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.large[1].widgets[0].betGroupGroupings[0].markets[0].id).toBe(2);

                expect(viewModel.small[0].widgets.length).toBe(2);
                expect(viewModel.small[0].widgets[1].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.small[0].widgets[1].betGroupGroupings[0].markets[0].id).toBe(2);
            });
        });

        describe("mergeDeletedMarkets", function () {

            it("should remove deleted markets from betgroups groupings", function () {
                var viewModel;

                var marketToBeDeleted = new MarketModelFactory({
                    id: 2,
                    name: "test",
                    betGroup: {
                        id: 1
                    },
                    selections: [{
                        id: 1
                    }]
                });

                viewModelAdapter.toViewModel([{
                    id: 1,
                    category: {
                        id: 1
                    },
                    getMarkets: function () {
                        return [
                            new MarketModelFactory({
                                id: 1,
                                name: "test",
                                betGroup: {
                                    id: 1
                                },
                                selections: [{
                                    id: 1
                                }]
                            }),
                            marketToBeDeleted
                        ];
                    }
                }]).then(function (_viewModel_) {
                    viewModel = _viewModel_;
                });

                $rootScope.$digest();

                viewModelAdapter.mergeDeletedMarkets(viewModel, [marketToBeDeleted]);

                $rootScope.$digest();

                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);

                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets.length).toBe(1);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);
            });

            it("should remove betgroup groupings if they no longer have any betgroups", function () {
                var viewModel;

                var marketToBeDeleted = new MarketModelFactory({
                    id: 2,
                    name: "test",
                    betGroup: {
                        id: 2
                    },
                    selections: [{
                        id: 1
                    }]
                });

                viewModelAdapter.toViewModel([{
                    id: 1,
                    category: {
                        id: 1
                    },
                    getMarkets: function () {
                        return [
                            new MarketModelFactory({
                                id: 1,
                                name: "test",
                                betGroup: {
                                    id: 1
                                },
                                selections: [{
                                    id: 1
                                }]
                            }),
                            marketToBeDeleted
                        ];
                    }
                }]).then(function (_viewModel_) {
                    viewModel = _viewModel_;
                });

                $rootScope.$digest();

                viewModelAdapter.mergeDeletedMarkets(viewModel, [marketToBeDeleted]);

                $rootScope.$digest();

                expect(viewModel.large[0].widgets[0].betGroupGroupings.length).toBe(1);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);

                expect(viewModel.small[0].widgets[0].betGroupGroupings.length).toBe(1);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);
            });

            it("should remove widgets if they no longer have any betgroup groupings", function () {
                var viewModel;

                var marketToBeDeleted = new MarketModelFactory({
                    id: 2,
                    name: "test",
                    betGroup: {
                        id: 3
                    },
                    selections: [{
                        id: 1
                    }]
                });

                viewModelAdapter.toViewModel([{
                    id: 1,
                    category: {
                        id: 1
                    },
                    getMarkets: function () {
                        return [
                            new MarketModelFactory({
                                id: 1,
                                name: "test",
                                betGroup: {
                                    id: 1
                                },
                                selections: [{
                                    id: 1
                                }]
                            }),
                            marketToBeDeleted
                        ];
                    }
                }]).then(function (_viewModel_) {
                    viewModel = _viewModel_;
                });

                $rootScope.$digest();

                viewModelAdapter.mergeDeletedMarkets(viewModel, [marketToBeDeleted]);

                $rootScope.$digest();

                expect(viewModel.large.length).toBe(2);
                expect(viewModel.large[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);

                expect(viewModel.small[0].widgets.length).toBe(1);
                expect(viewModel.small[0].widgets[0].betGroupGroupings[0].markets[0].id).toBe(1);
            });
        });
    });
});
