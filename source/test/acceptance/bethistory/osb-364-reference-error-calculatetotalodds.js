describe("OSB-364 Reference error \"calculateTotalOdds\" is undefined in betHistoryService", function () {

    var $httpBackend,
        betHistory;

    beforeEach(module("sportsbook.tests"));

    beforeEach(inject(["betHistory", "$httpBackend", function (_betHistory_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        betHistory = _betHistory_;
    }]));

    it("should not occur when bet.status === 2", function (done) {

        $httpBackend.when("GET", "http://betting.test.com/bethistory?fromDate=2016-01-01&merchantId=7&sessionId=TEST_TOKEN&toDate=2016-01-02").respond({
            "betHistoryItems": [{
                "couponId": 252751471,
                "couponArriveDate": "2015-12-15T14:36:54.997",
                "stake": 3.8000,
                "betStatus": 1,
                "isLive": false,
                "isMobile": false,
                "isBonus": false
            }],
            "numberOfCoupons": 9,
            "numberOfPages": 2
        });

        $httpBackend.when("GET", "http://betting.test.com/bethistorydetails?couponId=252751471&languageCode=en&merchantId=7&segmentId=601&sessionId=TEST_TOKEN").respond({
            "coupon": {
                "bets": [{
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 1,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 2,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 3,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 4,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 5,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 1.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18255924,
                        "odds": 1.53,
                        "marketId": 4921005,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 6,
                    "merchantBetId": 1,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 0.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18256917,
                        "odds": 1.75,
                        "marketId": 4921198,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 7,
                    "merchantBetId": 2,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 0.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18257038,
                        "odds": 1.4,
                        "marketId": 4921224,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 8,
                    "merchantBetId": 3,
                    "betType": 1,
                    "payout": 0
                }, {
                    "stake": 0.95,
                    "stakeForReview": 0,
                    "betSelections": [{
                        "marketSelectionId": 18292053,
                        "odds": 3.2,
                        "marketId": 4933331,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 9,
                    "merchantBetId": 4,
                    "betType": 1,
                    "payout": 0
                }],
                "bonusCustomerId": null,
                "isForManualAttest": false,
                "couponId": 252751471
            },
            "market": [{
                "marketID": 4921005,
                "marketRules": [{
                    "marketRuleID": 1
                }],
                "marketProperties": [{
                    "marketPropertyTypeID": 0,
                    "marketPropertyValue": 0
                }],
                "deadline": "2016-01-29T15:00:00+01:00",
                "marketStatus": 10,
                "betGroup": {
                    "betGroupID": 1,
                    "betGroupTypeID": 1,
                    "betGroupGroupings": [
                        1,
                        36
                    ],
                    "betGroupTypeClassificationID": 1,
                    "betGroupName": "Match Winner",
                    "betGroupDisplayName": "Match Winner",
                    "unitName": ""
                },
                "marketSelections": [{
                    "marketSelectionID": 18255924,
                    "odds": 2.25,
                    "sortorder": 1,
                    "selectionGroup": 1,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 1,
                    "selectionName": "1",
                    "selectionDisplayName": "1",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18255925,
                    "odds": 3.5,
                    "sortorder": 2,
                    "selectionGroup": 2,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 2,
                    "selectionName": "X",
                    "selectionDisplayName": "X",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18255926,
                    "odds": 3.45,
                    "sortorder": 3,
                    "selectionGroup": 3,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 3,
                    "selectionName": "2",
                    "selectionDisplayName": "2",
                    "subparticipantName": ""
                }],
                "eventID": 663821,
                "eventName": "Genoa - Fiorentina",
                "eventDisplayName": "Genoa - Fiorentina: Match Winner",
                "marketDisplayName": "Match Winner",
                "marketHelpText": "",
                "betGroupDisplayName": "Match Winner",
                "subCategoryID": 9,
                "categoryID": 1,
                "marketCount": 28,
                "resultString": "",
                "marketPresentationType": 1,
                "participants": [{
                    "participantID": 1708,
                    "participantName": "",
                    "participantOrder": 1,
                    "subparticipants": [{
                        "eventId": 0,
                        "participantID": 1708,
                        "participantName": "Goran Pandev",
                        "subparticipantID": 88966,
                        "participantOrder": 0,
                        "isHomeTeamPlayer": 1,
                        "isStartingPitcher": false
                    }],
                    "eventParticipantReferenceID": 0
                }],
                "hcpDisplayString": null,
                "betgroupDisplayString": "Match Winner",
                "startingPitcherDisplayString": null,
                "betgroupBetSlipDisplayString": null,
                "groupingName": null,
                "betGroupDescriptionText": "",
                "isLive": 0,
                "isTv": 0,
                "deadlineDateTime": "29/01/2016 15:00:00",
                "deadlineDate": "29/01/2016",
                "deadlineTime": "15:00",
                "deadlineDay": "Fri"
            }, {
                "marketID": 4921198,
                "marketRules": [{
                    "marketRuleID": 1
                }],
                "marketProperties": [{
                    "marketPropertyTypeID": 0,
                    "marketPropertyValue": 0
                }],
                "deadline": "2016-01-30T15:00:00+01:00",
                "marketStatus": 10,
                "betGroup": {
                    "betGroupID": 1,
                    "betGroupTypeID": 1,
                    "betGroupGroupings": [
                        1,
                        36
                    ],
                    "betGroupTypeClassificationID": 1,
                    "betGroupName": "Match Winner",
                    "betGroupDisplayName": "Match Winner",
                    "unitName": ""
                },
                "marketSelections": [{
                    "marketSelectionID": 18256917,
                    "odds": 1.75,
                    "sortorder": 1,
                    "selectionGroup": 1,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 1,
                    "selectionName": "1",
                    "selectionDisplayName": "1",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18256918,
                    "odds": 3.4,
                    "sortorder": 2,
                    "selectionGroup": 2,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 2,
                    "selectionName": "X",
                    "selectionDisplayName": "X",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18256919,
                    "odds": 4.9,
                    "sortorder": 3,
                    "selectionGroup": 3,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 3,
                    "selectionName": "2",
                    "selectionDisplayName": "2",
                    "subparticipantName": ""
                }],
                "eventID": 663830,
                "eventName": "Tottenham - West Ham",
                "eventDisplayName": "Tottenham - West Ham: Match Winner",
                "marketDisplayName": "Match Winner",
                "marketHelpText": "",
                "betGroupDisplayName": "Match Winner",
                "subCategoryID": 3,
                "categoryID": 1,
                "marketCount": 27,
                "resultString": "",
                "marketPresentationType": 1,
                "participants": [],
                "hcpDisplayString": null,
                "betgroupDisplayString": "Match Winner",
                "startingPitcherDisplayString": null,
                "betgroupBetSlipDisplayString": null,
                "groupingName": null,
                "betGroupDescriptionText": "",
                "isLive": 0,
                "isTv": 0,
                "deadlineDateTime": "30/01/2016 15:00:00",
                "deadlineDate": "30/01/2016",
                "deadlineTime": "15:00",
                "deadlineDay": "Sat"
            }, {
                "marketID": 4921224,
                "marketRules": [{
                    "marketRuleID": 1
                }],
                "marketProperties": [{
                    "marketPropertyTypeID": 0,
                    "marketPropertyValue": 0
                }],
                "deadline": "2016-01-30T15:00:00+01:00",
                "marketStatus": 10,
                "betGroup": {
                    "betGroupID": 1,
                    "betGroupTypeID": 1,
                    "betGroupGroupings": [
                        1,
                        36
                    ],
                    "betGroupTypeClassificationID": 1,
                    "betGroupName": "Match Winner",
                    "betGroupDisplayName": "Match Winner",
                    "unitName": ""
                },
                "marketSelections": [{
                    "marketSelectionID": 18257038,
                    "odds": 1.4,
                    "sortorder": 1,
                    "selectionGroup": 1,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 1,
                    "selectionName": "1",
                    "selectionDisplayName": "1",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18257039,
                    "odds": 4.5,
                    "sortorder": 2,
                    "selectionGroup": 2,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 2,
                    "selectionName": "X",
                    "selectionDisplayName": "X",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18257040,
                    "odds": 7.5,
                    "sortorder": 3,
                    "selectionGroup": 3,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 3,
                    "selectionName": "2",
                    "selectionDisplayName": "2",
                    "subparticipantName": ""
                }],
                "eventID": 663831,
                "eventName": "Arsenal - West Brom",
                "eventDisplayName": "Arsenal - West Brom: Match Winner",
                "marketDisplayName": "Match Winner",
                "marketHelpText": "",
                "betGroupDisplayName": "Match Winner",
                "subCategoryID": 3,
                "categoryID": 1,
                "marketCount": 26,
                "resultString": "",
                "marketPresentationType": 1,
                "participants": [],
                "hcpDisplayString": null,
                "betgroupDisplayString": "Match Winner",
                "startingPitcherDisplayString": null,
                "betgroupBetSlipDisplayString": null,
                "groupingName": null,
                "betGroupDescriptionText": "",
                "isLive": 0,
                "isTv": 0,
                "deadlineDateTime": "30/01/2016 15:00:00",
                "deadlineDate": "30/01/2016",
                "deadlineTime": "15:00",
                "deadlineDay": "Sat"
            }, {
                "marketID": 4933331,
                "marketRules": [{
                    "marketRuleID": 1
                }],
                "marketProperties": [{
                    "marketPropertyTypeID": 0,
                    "marketPropertyValue": 0
                }],
                "deadline": "2016-01-10T10:32:00+01:00",
                "marketStatus": 10,
                "betGroup": {
                    "betGroupID": 1,
                    "betGroupTypeID": 1,
                    "betGroupGroupings": [
                        1,
                        36
                    ],
                    "betGroupTypeClassificationID": 1,
                    "betGroupName": "Match Winner",
                    "betGroupDisplayName": "Match Winner",
                    "unitName": ""
                },
                "marketSelections": [{
                    "marketSelectionID": 18292053,
                    "odds": 3.2,
                    "sortorder": 1,
                    "selectionGroup": 1,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 1,
                    "selectionName": "1",
                    "selectionDisplayName": "1",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18292054,
                    "odds": 2.2,
                    "sortorder": 2,
                    "selectionGroup": 2,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 2,
                    "selectionName": "X",
                    "selectionDisplayName": "X",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18292055,
                    "odds": 2.9,
                    "sortorder": 3,
                    "selectionGroup": 3,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 3,
                    "selectionName": "2",
                    "selectionDisplayName": "2",
                    "subparticipantName": ""
                }],
                "eventID": 664500,
                "eventName": "Road Runner - Wile E. Coyote",
                "eventDisplayName": "Road Runner - Wile E. Coyote: Match Winner",
                "marketDisplayName": "Match Winner",
                "marketHelpText": "",
                "betGroupDisplayName": "Match Winner",
                "subCategoryID": 4403,
                "categoryID": 1,
                "marketCount": 5,
                "resultString": "",
                "marketPresentationType": 1,
                "participants": [],
                "hcpDisplayString": null,
                "betgroupDisplayString": "Match Winner",
                "startingPitcherDisplayString": null,
                "betgroupBetSlipDisplayString": null,
                "groupingName": null,
                "betGroupDescriptionText": "",
                "isLive": 0,
                "isTv": 0,
                "deadlineDateTime": "10/01/2016 10:32:00",
                "deadlineDate": "10/01/2016",
                "deadlineTime": "10:32",
                "deadlineDay": "Sun"
            }],
            "subCategory": [{
                "subCategoryID": 9,
                "subCategoryName": "Italian Serie A",
                "categoryId": 1,
                "categoryName": "Football",
                "regionName": "Italy"
            }, {
                "subCategoryID": 3,
                "subCategoryName": "FA Premiership",
                "categoryId": 1,
                "categoryName": "Football",
                "regionName": "England"
            }, {
                "subCategoryID": 3,
                "subCategoryName": "FA Premiership",
                "categoryId": 1,
                "categoryName": "Football",
                "regionName": "England"
            }, {
                "subCategoryID": 4403,
                "subCategoryName": "Russia 2 Centre",
                "categoryId": 1,
                "categoryName": "Football",
                "regionName": "International"
            }],
            "rejectedAmount": 0,
            "grantedAmount": 0,
            "originalAmount": 0
        });

        betHistory.getHistoryWithDetails({
            "fromDate": new Date(2016, 0, 1, 0, 0, 0, 0),
            "toDate": new Date(2016, 0, 2, 0, 0, 0, 0)
        }).then(function (viewModel) {
            expect(viewModel).toBeDefined();
            done();
        }, function (error) {
            fail("http request failed");
            done();
        });

        $httpBackend.flush();

    });

});
