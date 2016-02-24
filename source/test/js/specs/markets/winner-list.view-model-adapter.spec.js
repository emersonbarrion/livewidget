describe("Viewmodel Adapter: Winner List", function () {

    var viewModelAdapter, $httpBackend, $rootScope, fullEventList, testEvent, testCategories, testMarkets, orphanMarket;

    beforeEach(module("sportsbook.winnerList"));

    beforeEach(inject(["winnerListViewModelAdapter", "catalogueService", "$q", "applicationState", "$httpBackend", "$rootScope", "widgetConfigurations", "eventModelFactory", "marketModelFactory",
        function (winnerListViewModelAdapter, catalogueService, $q, applicationState, _$httpBackend, _$rootScope, widgetConfigurations, EventModel, MarketModel) {
            viewModelAdapter = winnerListViewModelAdapter;
            $httpBackend = _$httpBackend;
            $rootScope = _$rootScope;

            applicationState.culture({
                "countryCode": "GB",
                "cultureInfo": "en-GB",
                "currencyCode": "GBP",
                "currencySymbol": "£",
                "dateFormat": "dd/MM/yy",
                "id": 601,
                "languageCode": "en",
                "name": "English",
                "numberFormat": ".",
                "timeFormat": "HH:mm",
                "urlMarketCode": "en"
            });

            spyOn(catalogueService, "getCategory").and.callFake(function (options) {
                return $q.when(testCategories[options.id]);
            });

            spyOn(widgetConfigurations, "getForSection").and.callFake(function (categoryId, section) {
                return $q.when(testWinnerListConfigurations[categoryId]);
            });

            EventModel.prototype.getMarkets = function () {
                return testMarkets[this.id];
            };

            MarketModel.prototype.getParent = function () {
                return _.find(testEvents, {
                    "id": this.eventId
                });
            };

            MarketModel.prototype.getSelections = function () {
                return this.selections;
            };

            testWinnerListConfigurations = {
                "1": {
                    "name": "winner-list",
                    "title": "sportsbook.widgets.winnerlist.Winnerlist",
                    "defaultTemplate": "/js/sportsbook/markets/winner-list-view.html",
                    "widgets": [{
                        "title": "sportsbook.widgets.winnerlist.Winnerlist",
                        "limit": 3,
                        "layout": ["large-6", "large-6"],
                        "groups": [{
                            "betGroupId": 78
                        }]
                    }]
                },
                "2": {
                    "name": "winner-list",
                    "title": "sportsbook.widgets.winnerlist.Winnerlist",
                    "defaultTemplate": "/js/sportsbook/markets/winner-list-view.html",
                    "widgets": [{
                        "title": "sportsbook.widgets.winnerlist.Winnerlist",
                        "limit": 3,
                        "layout": ["large-6", "large-6"],
                        "groups": [{
                            "betGroupId": 149
                        }, {
                            "betGroupId": 300,
                            "isHeadToHead": true
                        }]
                    }]
                },
                "38": {
                    "name": "winner-list",
                    "title": "sportsbook.widgets.winnerlist.Winnerlist",
                    "defaultTemplate": "/js/sportsbook/markets/winner-list-view.html",
                    "widgets": [{
                        "title": "sportsbook.widgets.winnerlist.Winnerlist",
                        "limit": 3,
                        "layout": ["large-6", "large-6"],
                        "defaultClass": "",
                        "groups": [{
                            "betGroupId": 270,
                            "isHeadToHead": true
                        }, {
                            "betGroupId": 269
                        }, {
                            "betGroupId": 3216
                        }, {
                            "betGroupId": 966
                        }]
                    }]
                }
            };

            testCategories = {
                "1": {
                    "id": 1,
                    "name": "Football",
                    "marketCount": 2432,
                    "parentId": 0,
                    "type": "Category",
                    "iconHint": "football",
                    "slug": "/en/football",
                    "checked": false,
                    "isSelected": false,
                    "sortRank": {
                        "defaultSortOrder": 5,
                        "popularityRank": 16
                    },
                    "children": [],
                    "eventCount": 65
                },
                "2": {
                    "id": 2,
                    "name": "Ice hockey",
                    "marketCount": 547,
                    "parentId": 0,
                    "type": "Category",
                    "iconHint": "ice-hockey",
                    "slug": "/en/ice-hockey",
                    "checked": false,
                    "isSelected": false,
                    "sortRank": {
                        "defaultSortOrder": 10,
                        "popularityRank": 14
                    },
                    "children": [],
                    "eventCount": 23
                },
                "38": {
                    "id": 38,
                    "name": "Athletics",
                    "marketCount": 15,
                    "parentId": 0,
                    "type": "Category",
                    "iconHint": "athletics",
                    "slug": "/en/athletics",
                    "checked": false,
                    "isSelected": false,
                    "sortRank": {
                        "defaultSortOrder": 25,
                        "popularityRank": 0
                    },
                    "children": [],
                    "eventCount": 3
                }
            };

            testMarkets = {
                // Football markets
                "663837": [
                    new MarketModel({
                        "eventId": 663837,
                        "id": 4921380,
                        "categoryId": 1,
                        "name": "Winner",
                        "deadline": "2016-01-30T15:00:00.000Z",
                        "text": "Only league matches count.",
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 78,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 143,
                                "name": "Outrights"
                            }
                        },
                        "selections": [{
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257764,
                            "name": "Chelsea",
                            "odds": 2.35,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257765,
                            "name": "Man City",
                            "odds": 2.85,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257766,
                            "name": "Manchester United",
                            "odds": 4.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257767,
                            "name": "Arsenal",
                            "odds": 8.5,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257768,
                            "name": "Tottenham",
                            "odds": 11.5,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257769,
                            "name": "Southampton FC",
                            "odds": 24,
                            "sortOrder": 6,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257770,
                            "name": "West Ham",
                            "odds": 45,
                            "sortOrder": 7,
                            "isDisabled": false
                        }, {
                            "marketId": 4921380,
                            "eventId": 663837,
                            "betGroupId": 78,
                            "id": 18257771,
                            "name": "Liverpool",
                            "odds": 95,
                            "sortOrder": 8,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],
                "665205": [
                    new MarketModel({
                        "eventId": 665205,
                        "id": 4948373,
                        "categoryId": 1,
                        "name": "Winner",
                        "deadline": "2015-10-30T13:00:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 78,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 143,
                                "name": "Outrights"
                            }
                        },
                        "selections": [{
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337306,
                            "name": "Italy",
                            "odds": 4.5,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337307,
                            "name": "England",
                            "odds": 6,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337308,
                            "name": "Spain",
                            "odds": 7.25,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337309,
                            "name": "France",
                            "odds": 9,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337310,
                            "name": "Tahiti",
                            "odds": 9,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337311,
                            "name": "New Caledonia",
                            "odds": 9,
                            "sortOrder": 6,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337312,
                            "name": "Jamaica",
                            "odds": 9,
                            "sortOrder": 7,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337313,
                            "name": "Burundi",
                            "odds": 9,
                            "sortOrder": 8,
                            "isDisabled": false
                        }, {
                            "marketId": 4948373,
                            "eventId": 665205,
                            "betGroupId": 78,
                            "id": 18337314,
                            "name": "Sri Lanka",
                            "odds": 9,
                            "sortOrder": 9,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],
                "665214": [
                    new MarketModel({
                        "eventId": 665214,
                        "id": 4948574,
                        "categoryId": 1,
                        "name": "Winner",
                        "deadline": "2016-07-30T12:00:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 78,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 143,
                                "name": "Outrights"
                            }
                        },
                        "selections": [{
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337908,
                            "name": "AC Milan",
                            "odds": 1.2,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337909,
                            "name": "Frosinone",
                            "odds": 5.5,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337910,
                            "name": "SS Lazio",
                            "odds": 5.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337911,
                            "name": "Carpi",
                            "odds": 11,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337912,
                            "name": "Juventus",
                            "odds": 22,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4948574,
                            "eventId": 665214,
                            "betGroupId": 78,
                            "id": 18337907,
                            "name": "Inter",
                            "odds": 750,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],
                "666745": [
                    new MarketModel({
                        "eventId": 666745,
                        "id": 4955770,
                        "categoryId": 1,
                        "name": "Winner",
                        "deadline": "2016-08-05T13:11:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 78,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 143,
                                "name": "Outrights"
                            }
                        },
                        "selections": [{
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368021,
                            "name": "Juventus",
                            "odds": 1.95,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368022,
                            "name": "Napoli",
                            "odds": 3.9,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368023,
                            "name": "AC Milan",
                            "odds": 5.25,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368024,
                            "name": "Inter",
                            "odds": 6.5,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368025,
                            "name": "Fiorentina",
                            "odds": 7.75,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368026,
                            "name": "Siena",
                            "odds": 25,
                            "sortOrder": 6,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368028,
                            "name": "Bologna",
                            "odds": 125,
                            "sortOrder": 7,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368029,
                            "name": "Cagliari",
                            "odds": 125,
                            "sortOrder": 8,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368030,
                            "name": "Modena",
                            "odds": 125,
                            "sortOrder": 9,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368031,
                            "name": "Parma",
                            "odds": 125,
                            "sortOrder": 10,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368032,
                            "name": "Catania",
                            "odds": 125,
                            "sortOrder": 11,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368033,
                            "name": "Sampdoria",
                            "odds": 125,
                            "sortOrder": 12,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368034,
                            "name": "Genoa",
                            "odds": 125,
                            "sortOrder": 13,
                            "isDisabled": false
                        }, {
                            "marketId": 4955770,
                            "eventId": 666745,
                            "betGroupId": 78,
                            "id": 18368027,
                            "name": "Verona",
                            "odds": 750,
                            "sortOrder": 14,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],


                // Ice Hockey markets
                "664036": [
                    new MarketModel({
                        "eventId": 664036,
                        "id": 4935582,
                        "categoryId": 2,
                        "name": "Winner",
                        "deadline": "2016-07-18T12:24:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 149,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 63,
                                "name": "Winner"
                            }
                        },
                        "selections": [{
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299758,
                            "name": "New York Rangers",
                            "odds": 5.5,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299759,
                            "name": "Vancouver Canucks",
                            "odds": 6.5,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299760,
                            "name": "Philadelphia Flyers",
                            "odds": 7.75,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299764,
                            "name": "Pittsburgh Penguins",
                            "odds": 9.75,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299765,
                            "name": "Phoenix Coyotes",
                            "odds": 19.5,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299761,
                            "name": "Detroit Red Wings",
                            "odds": 20,
                            "sortOrder": 6,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299762,
                            "name": "Boston Bruins",
                            "odds": 10.5,
                            "sortOrder": 7,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299763,
                            "name": "San Jose Sharks",
                            "odds": 10.5,
                            "sortOrder": 8,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299766,
                            "name": "Buffalo Sabres",
                            "odds": 22,
                            "sortOrder": 9,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299767,
                            "name": "Chicago Blackhawks",
                            "odds": 10.5,
                            "sortOrder": 10,
                            "isDisabled": false
                        }, {
                            "marketId": 4935582,
                            "eventId": 664036,
                            "betGroupId": 149,
                            "id": 18299768,
                            "name": "Montreal Canadiens",
                            "odds": 10.5,
                            "sortOrder": 11,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],
                "664071": [
                    new MarketModel({
                        "eventId": 664071,
                        "id": 4927605,
                        "categoryId": 2,
                        "name": "Winner",
                        "deadline": "2016-02-19T14:15:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 149,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 63,
                                "name": "Winner"
                            }
                        },
                        "selections": [{
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274674,
                            "name": "Färjestad BK",
                            "odds": 3,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274675,
                            "name": "Linköpings HC",
                            "odds": 4,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274676,
                            "name": "Brynäs IF",
                            "odds": 10,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274677,
                            "name": "Djurgårdens IF",
                            "odds": 20,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274678,
                            "name": "Skellefteå AIK",
                            "odds": 3.5,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4927605,
                            "eventId": 664071,
                            "betGroupId": 149,
                            "id": 18274679,
                            "name": "MODO Hockey",
                            "odds": 4.2,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    }),
                    new MarketModel({
                        "eventId": 664071,
                        "id": 4927643,
                        "categoryId": 2,
                        "name": "Best Finishing Position",
                        "deadline": "2016-02-19T14:15:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 300,
                            "name": "Best Finishing Position",
                            "text": "Which team will have the best finishing position",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4927643,
                            "eventId": 664071,
                            "betGroupId": 300,
                            "id": 18274832,
                            "name": "Djurgårdens IF",
                            "odds": 1.96,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4927643,
                            "eventId": 664071,
                            "betGroupId": 300,
                            "id": 18274833,
                            "name": "MODO Hockey",
                            "odds": 1.66,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T10:22:20.907Z"
                    })
                ],


                // Athletics markets
                "664018": [
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926857,
                        "categoryId": 38,
                        "name": "Winner",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 269,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 63,
                                "name": "Winner"
                            }
                        },
                        "selections": [{
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271331,
                            "name": "Johan Andersson",
                            "odds": 100,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271332,
                            "name": "Mikael C Nilsson",
                            "odds": 100,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271333,
                            "name": "Daniel Massa",
                            "odds": 225,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271334,
                            "name": "Kevin Farrugia",
                            "odds": 100,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271335,
                            "name": "Ben Johnson",
                            "odds": 5,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4926857,
                            "eventId": 664018,
                            "betGroupId": 269,
                            "id": 18271336,
                            "name": "Carl Lewis",
                            "odds": 1.19,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }),
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926858,
                        "categoryId": 38,
                        "name": "Head To Head",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4926858,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271337,
                            "name": "Johan Andersson",
                            "odds": 3,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4926858,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271338,
                            "name": "Mikael C Nilsson",
                            "odds": 1.35,
                            "sortOrder": 2,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }),
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926859,
                        "categoryId": 38,
                        "name": "Top 2 Athletics",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 3216,
                            "name": "Top 2 Athletics",
                            "text": "",
                            "group": {
                                "id": 4,
                                "name": "Specials"
                            }
                        },
                        "selections": [{
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271344,
                            "name": "Carl Lewis",
                            "odds": 2.2,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271343,
                            "name": "Ben Johnson",
                            "odds": 2.4,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271342,
                            "name": "Kevin Farrugia",
                            "odds": 10.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271341,
                            "name": "Daniel Massa",
                            "odds": 750,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271340,
                            "name": "Mikael C Nilsson",
                            "odds": 8.75,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4926859,
                            "eventId": 664018,
                            "betGroupId": 3216,
                            "id": 18271339,
                            "name": "Johan Andersson",
                            "odds": 1000,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }),
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926860,
                        "categoryId": 38,
                        "name": "Head To Head",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4926860,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271345,
                            "name": "Mikael C Nilsson",
                            "odds": 1.74,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4926860,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271346,
                            "name": "Daniel Massa",
                            "odds": 2,
                            "sortOrder": 3,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }),
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926861,
                        "categoryId": 38,
                        "name": "Head To Head",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4926861,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271347,
                            "name": "Kevin Farrugia",
                            "odds": 8.05,
                            "sortOrder": 4,
                            "isDisabled": false
                        }, {
                            "marketId": 4926861,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271348,
                            "name": "Ben Johnson",
                            "odds": 1.05,
                            "sortOrder": 5,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }),
                    new MarketModel({
                        "eventId": 664018,
                        "id": 4926862,
                        "categoryId": 38,
                        "name": "Head To Head",
                        "deadline": "2016-02-17T14:08:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4926862,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271349,
                            "name": "Ben Johnson",
                            "odds": 3,
                            "sortOrder": 5,
                            "isDisabled": false
                        }, {
                            "marketId": 4926862,
                            "eventId": 664018,
                            "betGroupId": 270,
                            "id": 18271350,
                            "name": "Carl Lewis",
                            "odds": 1.35,
                            "sortOrder": 6,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    })
                ],
                "664807": [
                    new MarketModel({
                        "eventId": 664807,
                        "id": 4939267,
                        "categoryId": 38,
                        "name": "Winner",
                        "deadline": "2016-07-02T14:47:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 269,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 63,
                                "name": "Winner"
                            }
                        },
                        "selections": [{
                            "marketId": 4939267,
                            "eventId": 664807,
                            "betGroupId": 269,
                            "id": 18310669,
                            "name": "Mikael C Nilsson",
                            "odds": 1.33,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4939267,
                            "eventId": 664807,
                            "betGroupId": 269,
                            "id": 18310670,
                            "name": "Johan Andersson",
                            "odds": 4.8,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4939267,
                            "eventId": 664807,
                            "betGroupId": 269,
                            "id": 18310671,
                            "name": "Tomas Alexanderson",
                            "odds": 8.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4939267,
                            "eventId": 664807,
                            "betGroupId": 269,
                            "id": 18310672,
                            "name": "Stefan Nordin",
                            "odds": 750,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664807,
                        "id": 4943048,
                        "name": "Head To Head",
                        "deadline": "2016-07-02T14:47:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4943048,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321965,
                            "name": "Mikael C Nilsson",
                            "odds": 1.74,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4943048,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321966,
                            "name": "Johan Andersson",
                            "odds": 2,
                            "sortOrder": 2,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664807,
                        "id": 4943049,
                        "name": "Head To Head",
                        "deadline": "2016-07-02T14:47:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4943049,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321967,
                            "name": "Mikael C Nilsson",
                            "odds": 1.74,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4943049,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321968,
                            "name": "Tomas Alexanderson",
                            "odds": 2,
                            "sortOrder": 3,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664807,
                        "id": 4943050,
                        "name": "Head To Head",
                        "deadline": "2016-07-02T14:47:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4943050,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321969,
                            "name": "Mikael C Nilsson",
                            "odds": 1.74,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4943050,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321970,
                            "name": "Stefan Nordin",
                            "odds": 2,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664807,
                        "id": 4943051,
                        "name": "Head To Head",
                        "deadline": "2016-07-02T14:47:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4943051,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321971,
                            "name": "Johan Andersson",
                            "odds": 1.74,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4943051,
                            "eventId": 664807,
                            "betGroupId": 270,
                            "id": 18321972,
                            "name": "Stefan Nordin",
                            "odds": 2,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    })
                ],
                "664832": [
                    new MarketModel({
                        "eventId": 664832,
                        "id": 4939779,
                        "categoryId": 38,
                        "name": "Winner",
                        "deadline": "2016-07-06T13:09:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 269,
                            "name": "Winner",
                            "text": "",
                            "group": {
                                "id": 63,
                                "name": "Winner"
                            }
                        },
                        "selections": [{
                            "marketId": 4939779,
                            "eventId": 664832,
                            "betGroupId": 269,
                            "id": 18312302,
                            "name": "Mikael C Nilsson",
                            "odds": 2,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4939779,
                            "eventId": 664832,
                            "betGroupId": 269,
                            "id": 18312303,
                            "name": "Johan Anderson",
                            "odds": 3.3,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4939779,
                            "eventId": 664832,
                            "betGroupId": 269,
                            "id": 18312304,
                            "name": "Robert Vella",
                            "odds": 5.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4939779,
                            "eventId": 664832,
                            "betGroupId": 269,
                            "id": 18312301,
                            "name": "Stefan Nordin",
                            "odds": 11,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664832,
                        "id": 4939780,
                        "name": "Head To Head",
                        "deadline": "2016-07-06T13:09:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4939780,
                            "eventId": 664832,
                            "betGroupId": 270,
                            "id": 18312305,
                            "name": "Stefan Nordin",
                            "odds": 3,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4939780,
                            "eventId": 664832,
                            "betGroupId": 270,
                            "id": 18312306,
                            "name": "Mikael C Nilsson",
                            "odds": 1.35,
                            "sortOrder": 2,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664832,
                        "id": 4939781,
                        "name": "Head To Head",
                        "deadline": "2016-07-06T13:09:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 270,
                            "name": "Head To Head",
                            "text": "",
                            "group": {
                                "id": 30,
                                "name": "Head to Head"
                            }
                        },
                        "selections": [{
                            "marketId": 4939781,
                            "eventId": 664832,
                            "betGroupId": 270,
                            "id": 18312307,
                            "name": "Johan Anderson",
                            "odds": 1.5,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4939781,
                            "eventId": 664832,
                            "betGroupId": 270,
                            "id": 18312308,
                            "name": "Robert Vella",
                            "odds": 2.45,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    }, {
                        "eventId": 664832,
                        "id": 4943052,
                        "name": "Top 2 Athletics",
                        "deadline": "2016-07-06T13:09:00.000Z",
                        "text": null,
                        "ruleId": 2,
                        "lineValue": 350,
                        "betGroup": {
                            "id": 3216,
                            "name": "Top 2 Athletics",
                            "text": "",
                            "group": {
                                "id": 4,
                                "name": "Specials"
                            }
                        },
                        "selections": [{
                            "marketId": 4943052,
                            "eventId": 664832,
                            "betGroupId": 3216,
                            "id": 18321973,
                            "name": "Stefan Nordin",
                            "odds": 3.2,
                            "sortOrder": 1,
                            "isDisabled": false
                        }, {
                            "marketId": 4943052,
                            "eventId": 664832,
                            "betGroupId": 3216,
                            "id": 18321974,
                            "name": "Mikael C Nilsson",
                            "odds": 3.4,
                            "sortOrder": 2,
                            "isDisabled": false
                        }, {
                            "marketId": 4943052,
                            "eventId": 664832,
                            "betGroupId": 3216,
                            "id": 18321975,
                            "name": "Johan Anderson",
                            "odds": 4,
                            "sortOrder": 3,
                            "isDisabled": false
                        }, {
                            "marketId": 4943052,
                            "eventId": 664832,
                            "betGroupId": 3216,
                            "id": 18321976,
                            "name": "Robert Vella",
                            "odds": 4.3,
                            "sortOrder": 4,
                            "isDisabled": false
                        }],
                        "timestamp": "2015-08-18T14:42:21.209Z"
                    })
                ]
            };

            testEvents = [
                new EventModel({
                    "id": 663837,
                    "name": "Premier League 2014-15",
                    "shortName": "/premier-league-2014-15",
                    "startDateTime": "2016-01-30T15:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 11,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 3,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 7,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 665205,
                    "name": "World Cup Winner",
                    "shortName": "/world-cup-winner",
                    "startDateTime": "2015-10-30T13:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 0,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 8738,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 1,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 665214,
                    "name": "Serie A 2015",
                    "shortName": "/serie-a-2015",
                    "startDateTime": "2016-07-30T12:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 17,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 9,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 1,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 666745,
                    "name": "Serie A 2015-16",
                    "shortName": "/serie-a-2015-16",
                    "startDateTime": "2016-08-05T13:11:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 17,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 9,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 2,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 664036,
                    "name": "Stanley Cup 2015",
                    "shortName": "/stanley-cup-2015",
                    "startDateTime": "2016-07-18T12:24:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 2,
                        "isStub": true
                    },
                    "region": {
                        "id": 35,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 50,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 5,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 664071,
                    "name": "Elitserien 2016",
                    "shortName": "/elitserien-2016",
                    "startDateTime": "2016-02-19T14:15:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 2,
                        "isStub": true
                    },
                    "region": {
                        "id": 26,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 2,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 6,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 664018,
                    "name": "100m sprint",
                    "shortName": "/100m-sprint",
                    "startDateTime": "2016-02-17T14:08:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 6,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                }),
                new EventModel({
                    "id": 664807,
                    "name": "100m running",
                    "shortName": "/100m-running",
                    "startDateTime": "2016-07-02T14:47:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 5,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                }),
                new EventModel({
                    "id": 664832,
                    "name": "100m hurdles",
                    "shortName": "/100m-hurdles",
                    "startDateTime": "2016-07-06T13:09:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 4,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                })
            ];

            footballAndIceHockeyEvents = [
                new EventModel({
                    "id": 663837,
                    "name": "Premier League 2014-15",
                    "shortName": "/premier-league-2014-15",
                    "startDateTime": "2016-01-30T15:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 11,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 3,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 7,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 665205,
                    "name": "World Cup Winner",
                    "shortName": "/world-cup-winner",
                    "startDateTime": "2015-10-30T13:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 0,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 8738,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 1,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 665214,
                    "name": "Serie A 2015",
                    "shortName": "/serie-a-2015",
                    "startDateTime": "2016-07-30T12:00:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 17,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 9,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 1,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 666745,
                    "name": "Serie A 2015-16",
                    "shortName": "/serie-a-2015-16",
                    "startDateTime": "2016-08-05T13:11:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 1,
                        "isStub": true
                    },
                    "region": {
                        "id": 17,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 9,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 2,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 664036,
                    "name": "Stanley Cup 2015",
                    "shortName": "/stanley-cup-2015",
                    "startDateTime": "2016-07-18T12:24:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 2,
                        "isStub": true
                    },
                    "region": {
                        "id": 35,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 50,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 5,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                }),
                new EventModel({
                    "id": 664071,
                    "name": "Elitserien 2016",
                    "shortName": "/elitserien-2016",
                    "startDateTime": "2016-02-19T14:15:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 2,
                        "isStub": true
                    },
                    "region": {
                        "id": 26,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 2,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 6,
                    "timestamp": "2015-08-17T15:19:03.032Z"
                })
            ];

            athleticsEvents = [
                new EventModel({
                    "id": 664018,
                    "name": "100m sprint",
                    "shortName": "/100m-sprint",
                    "startDateTime": "2016-02-17T14:08:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 6,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                }),
                new EventModel({
                    "id": 664807,
                    "name": "100m running",
                    "shortName": "/100m-running",
                    "startDateTime": "2016-07-02T14:47:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 5,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                }),
                new EventModel({
                    "id": 664832,
                    "name": "100m hurdles",
                    "shortName": "/100m-hurdles",
                    "startDateTime": "2016-07-06T13:09:00.000Z",
                    "isLive": false,
                    "liveEvent": false,
                    "liveStream": false,
                    "category": {
                        "id": 38,
                        "isStub": true
                    },
                    "region": {
                        "id": 1,
                        "isStub": true
                    },
                    "subCategory": {
                        "id": 1242,
                        "isStub": true
                    },
                    "participants": [],
                    "sortRank": {},
                    "marketCount": 4,
                    "timestamp": "2015-08-18T14:42:21.208Z"
                })
            ];

            testEvent = new EventModel({
                "id": 663837,
                "name": "Premier League 2014-15",
                "shortName": "/premier-league-2014-15",
                "startDateTime": "2016-01-30T15:00:00.000Z",
                "isLive": false,
                "liveEvent": false,
                "liveStream": false,
                "category": {
                    "id": 1,
                    "isStub": true
                },
                "region": {
                    "id": 11,
                    "isStub": true
                },
                "subCategory": {
                    "id": 3,
                    "isStub": true
                },
                "participants": [],
                "sortRank": {},
                "marketCount": 7,
                "timestamp": "2015-08-17T15:19:03.032Z"
            });

            orphanMarket = new MarketModel({
                "eventId": 123654,
                "id": 321456,
                "categoryId": 38,
                "name": "Winner",
                "deadline": "2016-07-06T13:09:00.000Z",
                "text": null,
                "ruleId": 2,
                "lineValue": 350,
                "betGroup": {
                    "id": 269,
                    "name": "Winner",
                    "text": "",
                    "group": {
                        "id": 63,
                        "name": "Winner"
                    }
                },
                "selections": [{
                    "marketId": 4939779,
                    "eventId": 664832,
                    "betGroupId": 269,
                    "id": 18312302,
                    "name": "Mikael C Nilsson",
                    "odds": 2,
                    "sortOrder": 1,
                    "isDisabled": false
                }, {
                    "marketId": 4939779,
                    "eventId": 664832,
                    "betGroupId": 269,
                    "id": 18312303,
                    "name": "Johan Anderson",
                    "odds": 3.3,
                    "sortOrder": 2,
                    "isDisabled": false
                }, {
                    "marketId": 4939779,
                    "eventId": 664832,
                    "betGroupId": 269,
                    "id": 18312304,
                    "name": "Robert Vella",
                    "odds": 5.5,
                    "sortOrder": 3,
                    "isDisabled": false
                }, {
                    "marketId": 4939779,
                    "eventId": 664832,
                    "betGroupId": 269,
                    "id": 18312301,
                    "name": "Stefan Nordin",
                    "odds": 11,
                    "sortOrder": 4,
                    "isDisabled": false
                }],
                "timestamp": "2015-08-18T14:42:21.209Z"
            }, {
                "eventId": 664832,
                "id": 4939780,
                "name": "Head To Head",
                "deadline": "2016-07-06T13:09:00.000Z",
                "text": null,
                "ruleId": 2,
                "lineValue": 350,
                "betGroup": {
                    "id": 270,
                    "name": "Head To Head",
                    "text": "",
                    "group": {
                        "id": 30,
                        "name": "Head to Head"
                    }
                },
                "selections": [{
                    "marketId": 4939780,
                    "eventId": 664832,
                    "betGroupId": 270,
                    "id": 18312305,
                    "name": "Stefan Nordin",
                    "odds": 3,
                    "sortOrder": 1,
                    "isDisabled": false
                }, {
                    "marketId": 4939780,
                    "eventId": 664832,
                    "betGroupId": 270,
                    "id": 18312306,
                    "name": "Mikael C Nilsson",
                    "odds": 1.35,
                    "sortOrder": 2,
                    "isDisabled": false
                }],
                "timestamp": "2015-08-18T14:42:21.209Z"
            }, {
                "eventId": 664832,
                "id": 4939781,
                "name": "Head To Head",
                "deadline": "2016-07-06T13:09:00.000Z",
                "text": null,
                "ruleId": 2,
                "lineValue": 350,
                "betGroup": {
                    "id": 270,
                    "name": "Head To Head",
                    "text": "",
                    "group": {
                        "id": 30,
                        "name": "Head to Head"
                    }
                },
                "selections": [{
                    "marketId": 4939781,
                    "eventId": 664832,
                    "betGroupId": 270,
                    "id": 18312307,
                    "name": "Johan Anderson",
                    "odds": 1.5,
                    "sortOrder": 3,
                    "isDisabled": false
                }, {
                    "marketId": 4939781,
                    "eventId": 664832,
                    "betGroupId": 270,
                    "id": 18312308,
                    "name": "Robert Vella",
                    "odds": 2.45,
                    "sortOrder": 4,
                    "isDisabled": false
                }],
                "timestamp": "2015-08-18T14:42:21.209Z"
            }, {
                "eventId": 664832,
                "id": 4943052,
                "name": "Top 2 Athletics",
                "deadline": "2016-07-06T13:09:00.000Z",
                "text": null,
                "ruleId": 2,
                "lineValue": 350,
                "betGroup": {
                    "id": 3216,
                    "name": "Top 2 Athletics",
                    "text": "",
                    "group": {
                        "id": 4,
                        "name": "Specials"
                    }
                },
                "selections": [{
                    "marketId": 4943052,
                    "eventId": 664832,
                    "betGroupId": 3216,
                    "id": 18321973,
                    "name": "Stefan Nordin",
                    "odds": 3.2,
                    "sortOrder": 1,
                    "isDisabled": false
                }, {
                    "marketId": 4943052,
                    "eventId": 664832,
                    "betGroupId": 3216,
                    "id": 18321974,
                    "name": "Mikael C Nilsson",
                    "odds": 3.4,
                    "sortOrder": 2,
                    "isDisabled": false
                }, {
                    "marketId": 4943052,
                    "eventId": 664832,
                    "betGroupId": 3216,
                    "id": 18321975,
                    "name": "Johan Anderson",
                    "odds": 4,
                    "sortOrder": 3,
                    "isDisabled": false
                }, {
                    "marketId": 4943052,
                    "eventId": 664832,
                    "betGroupId": 3216,
                    "id": 18321976,
                    "name": "Robert Vella",
                    "odds": 4.3,
                    "sortOrder": 4,
                    "isDisabled": false
                }],
                "timestamp": "2015-08-18T14:42:21.209Z"
            });

        }
    ]));

    describe("toViewModel", function () {

        it("should convert a list of events to a winner market list view model", function (done) {

            viewModelAdapter.toViewModel([testEvent]).then(function (viewModel) {
                expect(viewModel.length).toBe(1);
                expect(viewModel[0].events[0].betGroups[0].markets[0].lineValue).toBe(350);
                expect(viewModel[0].categoryNode.id).toBe(1);
                expect(viewModel[0].events.length).toBe(1);
                expect(viewModel[0].events[0].id).toBe(663837);
                done();
            });

            $rootScope.$digest();
        });

    });

    describe("mergeNewEvents", function () {

        var viewModel;

        beforeEach(function (done) {
            var workingEventList = _.clone(footballAndIceHockeyEvents).slice(1);
            viewModelAdapter.toViewModel(workingEventList).then(function (_viewModel) {
                viewModel = _viewModel;
                done();
            }).catch(function () {
                fail("Could not convert event list to view model.");
            });
            $rootScope.$digest();
        });

        it("should merge new events into the given view model", function (done) {
            expect(viewModel.length).toBe(2);
            expect(viewModel[0].categoryNode.id).toBe(1);
            expect(viewModel[1].categoryNode.id).toBe(2);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[1].events.length).toBe(2);

            // adding just one event
            viewModelAdapter.mergeNewEvents(viewModel, [testEvent]).then(function (result) {
                expect(result).toBe(true);
                expect(viewModel.length).toBe(2);
                expect(viewModel[0].categoryNode.id).toBe(1);
                expect(viewModel[1].categoryNode.id).toBe(2);
                expect(viewModel[0].events.length).toBe(4);
                expect(viewModel[1].events.length).toBe(2);
                expect(viewModel[0].events[viewModel[0].events.length - 1]).toBeDefined();
                expect(viewModel[0].events[viewModel[0].events.length - 1].id).toBe(663837);

                return viewModelAdapter.mergeNewEvents(viewModel, athleticsEvents);

                // adding an entire new category
            }).then(function (result) {
                expect(result).toBe(true);
                expect(viewModel.length).toBe(3);
                expect(viewModel[0].categoryNode.id).toBe(1);
                expect(viewModel[1].categoryNode.id).toBe(2);
                expect(viewModel[2].categoryNode.id).toBe(38);
                expect(viewModel[0].events.length).toBe(4);
                expect(viewModel[1].events.length).toBe(2);
                expect(viewModel[2].events.length).toBe(3);

                done();
            }).catch(function (error) {
                fail(error);
            });

        });

        it("should throw on invalid inputs", function () {
            expect(function () {
                viewModelAdapter.mergeNewEvents();
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeNewEvents(viewModel);
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeNewEvents(null, [testEvent]);
            }).toThrow();
        });

    });


    describe("mergeDeletedEvents", function () {

        var viewModel;

        beforeEach(function (done) {
            var workingEventList = _.clone(footballAndIceHockeyEvents);
            viewModelAdapter.toViewModel(workingEventList).then(function (_viewModel) {
                viewModel = _viewModel;
                done();
            }).catch(function () {
                fail("Could not convert event list to view model.");
            });
            // $httpBackend.flush();
            $rootScope.$digest();
        });

        it("should remove the deleted events from the given view model", function () {
            expect(viewModel.length).toBe(2);
            expect(viewModel[0].categoryNode.id).toBe(1);
            expect(viewModel[1].categoryNode.id).toBe(2);
            expect(viewModel[0].events.length).toBe(4);
            expect(viewModel[1].events.length).toBe(2);

            viewModelAdapter.mergeDeletedEvents(viewModel, [testEvents[3]]);

            expect(viewModel.length).toBe(2);
            expect(viewModel[0].categoryNode.id).toBe(1);
            expect(viewModel[1].categoryNode.id).toBe(2);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[1].events.length).toBe(2);

            viewModelAdapter.mergeDeletedEvents(viewModel, [testEvents[0], testEvents[4], testEvents[5]]);

            expect(viewModel.length).toBe(1);
            expect(viewModel[0].categoryNode.id).toBe(1);
            expect(viewModel[0].events.length).toBe(2);
        });

        it("should throw on invalid inputs", function () {
            expect(function () {
                viewModelAdapter.mergeDeletedEvents();
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeDeletedEvents(viewModel);
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeDeletedEvents(null, [123456]);
            }).toThrow();
        });

    });


    describe("mergeNewMarkets", function () {

        var viewModel, marketsToAdd;

        beforeEach(function (done) {
            var workingEventList = athleticsEvents;
            marketsToAdd = _.pullAt(testMarkets[664018], 0, 1);
            viewModelAdapter.toViewModel(workingEventList).then(function (_viewModel) {
                viewModel = _viewModel;
                done();
            }).catch(function () {
                fail("Could not convert event list to view model.");
            });
            $rootScope.$apply();
        });

        it("should merge new markets into existing events inside given view model", function (done) {
            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[0].events[0].betGroups.length).toBe(2);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(1);
            expect(viewModel[0].events[1].betGroups.length).toBe(1);
            expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[2].betGroups.length).toBe(1);
            expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);

            // adding two new markets
            viewModelAdapter.mergeNewMarkets(viewModel, marketsToAdd).then(function (result) {
                expect(result).toBe(true);
                expect(viewModel.length).toBe(1);
                expect(viewModel[0].events.length).toBe(3);
                expect(viewModel[0].events[0].betGroups.length).toBe(3);
                expect(viewModel[0].events[0].betGroups[0].id).toBe(270);
                expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(4);
                expect(viewModel[0].events[0].betGroups[1].id).toBe(3216);
                expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(1);
                expect(viewModel[0].events[0].betGroups[2].id).toBe(269);
                expect(viewModel[0].events[0].betGroups[2].markets.length).toBe(1);
                expect(viewModel[0].events[1].betGroups.length).toBe(1);
                expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
                expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
                expect(viewModel[0].events[2].betGroups.length).toBe(1);
                expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
                expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);


                done();
            }).catch(function (error) {
                fail(error);
            });
        });

        it("should fail silently when trying to add new markets belonging to an event that does not exist in the repository", function (done) {
            viewModelAdapter.mergeNewMarkets(viewModel, [orphanMarket]).then(function (result) {
                expect(result).toBe(false);
                done();
            });
        });

        it("should throw on invalid inputs", function (done) {
            expect(function () {
                viewModelAdapter.mergeNewMarkets();
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeNewMarkets(viewModel);
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeNewMarkets(null, marketsToAdd);
            }).toThrow();
            done();
        });

    });


    describe("mergeDeletedMarkets", function () {

        var viewModel;

        beforeEach(function (done) {
            var workingEventList = athleticsEvents;
            viewModelAdapter.toViewModel(workingEventList).then(function (_viewModel) {
                viewModel = _viewModel;
                done();
            }).catch(function () {
                fail("Could not convert event list to view model.");
            });
            // $httpBackend.flush();
            $rootScope.$apply();
        });

        it("should remove the deleted markets from existing events in the given view model", function () {
            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[0].events[0].betGroups.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(4);
            expect(viewModel[0].events[0].betGroups[2].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[2].markets.length).toBe(1);
            expect(viewModel[0].events[1].betGroups.length).toBe(1);
            expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[2].betGroups.length).toBe(1);
            expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);

            // removing a single market
            var market = testMarkets[664018][3];
            viewModelAdapter.mergeDeletedMarkets(viewModel, [market]);

            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[0].events[0].betGroups.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[2].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[2].markets.length).toBe(1);
            expect(viewModel[0].events[1].betGroups.length).toBe(1);
            expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[2].betGroups.length).toBe(1);
            expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);

            // removing an entire bet group
            var market1 = testMarkets[664018][0];
            var market2 = testMarkets[664807][0];
            var market3 = testMarkets[664832][0];
            viewModelAdapter.mergeDeletedMarkets(viewModel, [market1, market2, market3]);

            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(1);
            expect(viewModel[0].events[0].betGroups.length).toBe(2);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(1);
        });

        it("should fail silently when trying to remove markets belonging to an event that does not exist in the view model", function () {
            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[0].events[0].betGroups.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(4);
            expect(viewModel[0].events[0].betGroups[2].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[2].markets.length).toBe(1);
            expect(viewModel[0].events[1].betGroups.length).toBe(1);
            expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[2].betGroups.length).toBe(1);
            expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);

            var market = testMarkets[664036][0];
            viewModelAdapter.mergeDeletedMarkets(viewModel, [market]);

            expect(viewModel.length).toBe(1);
            expect(viewModel[0].events.length).toBe(3);
            expect(viewModel[0].events[0].betGroups.length).toBe(3);
            expect(viewModel[0].events[0].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[0].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[0].betGroups[1].id).toBe(270);
            expect(viewModel[0].events[0].betGroups[1].markets.length).toBe(4);
            expect(viewModel[0].events[0].betGroups[2].id).toBe(3216);
            expect(viewModel[0].events[0].betGroups[2].markets.length).toBe(1);
            expect(viewModel[0].events[1].betGroups.length).toBe(1);
            expect(viewModel[0].events[1].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[1].betGroups[0].markets.length).toBe(1);
            expect(viewModel[0].events[2].betGroups.length).toBe(1);
            expect(viewModel[0].events[2].betGroups[0].id).toBe(269);
            expect(viewModel[0].events[2].betGroups[0].markets.length).toBe(1);
        });

        it("should throw on invalid inputs", function () {
            expect(function () {
                viewModelAdapter.mergeDeletedMarkets();
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeDeletedMarkets(viewModel);
            }).toThrow();
            expect(function () {
                viewModelAdapter.mergeDeletedMarkets(null, [4926857]);
            }).toThrow();
        });

    });


    describe("Data Source changes", function () {

        var viewModel;

        beforeEach(function (done) {
            var workingEventList = athleticsEvents;
            viewModelAdapter.toViewModel(workingEventList).then(function (_viewModel) {
                viewModel = _viewModel;
                done();
            }).catch(function () {
                fail("Could not convert event list to view model.");
            });
            $rootScope.$apply();
        });

        it("should trigger the merge new events method for new events", function () {
            var scope = $rootScope.$new(true);
            viewModelAdapter.registerEventsAddedListener(scope, viewModel, "testDataSource");
            spyOn(viewModelAdapter, "mergeNewEvents").and.stub();
            $rootScope.$broadcast("testDataSource-added", [testEvent]);
            expect(viewModelAdapter.mergeNewEvents).toHaveBeenCalledWith(viewModel, [testEvent]);
        });

        it("should trigger the merge deleted events method for deleted events", function () {
            var scope = $rootScope.$new(true);
            viewModelAdapter.registerEventsDeletedListener(scope, viewModel, "testDataSource");
            spyOn(viewModelAdapter, "mergeDeletedEvents").and.stub();
            $rootScope.$broadcast("testDataSource-deleted", [663837]);
            expect(viewModelAdapter.mergeDeletedEvents).toHaveBeenCalledWith(viewModel, [663837]);
        });

        it("should trigger the merge new markets method for new markets", function () {
            var scope = $rootScope.$new(true);
            viewModelAdapter.registerMarketsAddedListener(scope, viewModel, "testDataSource");
            spyOn(viewModelAdapter, "mergeNewMarkets").and.stub();
            $rootScope.$broadcast("testDataSource-markets-added", [testMarkets[664832][0]]);
            expect(viewModelAdapter.mergeNewMarkets).toHaveBeenCalledWith(viewModel, [testMarkets[664832][0]]);
        });

        it("should trigger the merge deleted events method for deleted events", function () {
            var scope = $rootScope.$new(true);
            viewModelAdapter.registerMarketsDeletedListener(scope, viewModel, "testDataSource");
            spyOn(viewModelAdapter, "mergeDeletedMarkets").and.stub();
            $rootScope.$broadcast("testDataSource-markets-deleted", [4939779]);
            expect(viewModelAdapter.mergeDeletedMarkets).toHaveBeenCalledWith(viewModel, [4939779]);
        });

    });

});
