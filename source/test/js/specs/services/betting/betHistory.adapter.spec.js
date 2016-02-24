describe("ViewModel Adapter: Bet history", function () {

    var adapter, translationKeysByBetStatus;

    beforeEach(module("sportsbook.betHistory"));

    beforeEach(inject(["betHistoryAdapter", function (betHistoryAdapter) {

        adapter = betHistoryAdapter;
        translationKeysByBetStatus = {
            1: "test"
        };

    }]));

    it("should convert bet history objects from the server", function () {

        var original = {
            "betHistoryItems": [{
                "couponId": 251314187,
                "couponArriveDate": "2015-04-28T06:55:03.313",
                "stake": 1.0000,
                "taxAmount": 0,
                "betStatus": 1,
                "isLive": false,
                "isMobile": false,
                "isBonus": false
            }],
            "numberOfPages": 2,
            "numberOfCoupons": 10
        };

        var formatted = {
            "betHistoryItems": [{
                "couponId": 251314187,
                "couponArriveDate": new Date("2015-04-28T06:55:03.313"),
                "stake": 1.0000,
                "taxAmount": 0,
                "betStatus": 1,
                "statusText": "test",
                "isLive": false,
                "isMobile": false,
                "isBonus": false
            }],
            "numberOfPages": 2,
            "numberOfCoupons": 10
        };

        expect(adapter.toBetHistory(original, translationKeysByBetStatus)).toEqual(formatted);
    });

    it("should convert bet history details objects from the server", function () {

        var original = {
            "coupon": {
                "bets": [{
                    "stake": 0,
                    "stakeForReview": 0,
                    "taxAmount": 0,
                    "betSelections": [{
                        "marketSelectionId": 18254392,
                        "odds": 1.51,
                        "marketId": 4920694,
                        "status": 1,
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 1,
                    "merchantBetId": 0,
                    "betType": 1,
                    "payout": 0
                }],
                "bonusCustomerId": null,
                "isForManualAttest": false,
                "couponId": 251324248
            },
            "market": [{
                "marketID": 4920694,
                "marketRules": [{
                    "marketRuleID": 1
                }],
                "marketProperties": [{
                    "marketPropertyTypeID": 0,
                    "marketPropertyValue": 0
                }],
                "deadline": "2016-01-28T19:45:00-08:00",
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
                    "marketSelectionID": 18254392,
                    "odds": 1.5,
                    "sortorder": 1,
                    "selectionGroup": 0,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 1,
                    "selectionName": "1",
                    "selectionDisplayName": "1",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18254393,
                    "odds": 3.75,
                    "sortorder": 2,
                    "selectionGroup": 0,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 2,
                    "selectionName": "X",
                    "selectionDisplayName": "X",
                    "subparticipantName": ""
                }, {
                    "marketSelectionID": 18254394,
                    "odds": 8,
                    "sortorder": 3,
                    "selectionGroup": 0,
                    "participantID": 0,
                    "subparticipantID": 0,
                    "selectionRepositoryItemID": 3,
                    "selectionName": "2",
                    "selectionDisplayName": "2",
                    "subparticipantName": ""
                }],
                "eventID": 663795,
                "eventName": "Arsenal - Ajax",
                "eventDisplayName": null,
                "marketDisplayName": null,
                "marketHelpText": "",
                "betGroupDisplayName": null,
                "subCategoryID": 166,
                "categoryID": 1,
                "marketCount": 26,
                "resultString": "",
                "marketPresentationType": 0,
                "participants": [],
                "hcpDisplayString": "",
                "betgroupDisplayString": "",
                "startingPitcherDisplayString": "",
                "betgroupBetSlipDisplayString": "",
                "groupingName": "",
                "betGroupDescriptionText": "",
                "isLive": 0,
                "isTv": 0,
                "deadlineDateTime": "28/01/2016 19:45:00",
                "deadlineDate": "28/01/2016",
                "deadlineTime": "19:45",
                "deadlineDay": "Thu"
            }],
            "subCategory": [{
                "subCategoryID": 166,
                "subCategoryName": "UEFA Champions League",
                "categoryId": 1,
                "categoryName": "Football",
                "regionName": "European cups"
            }],
            "rejectedAmount": 0,
            "grantedAmount": 0,
            "originalAmount": 0
        };

        var formatted = {
            "coupon": {
                "bets": [{
                    "stake": 0,
                    "stakeForReview": 0,
                    "taxAmount": 0,
                    "latestDeadline": new Date('Fri Jan 29 2016 04:45:00 GMT+0100 (W. Europe Standard Time)'),
                    "potentialWinnings": 0,
                    "totalWon": 0,
                    "statusText": 'test',
                    "totalOdds": 1.51,
                    "selections": [{
                        "id": 18254392,
                        "market": {
                            "id": 4920694,
                            "deadline": new Date("2016-01-28T19:45:00-08:00"),
                            "marketStatus": 10,
                            "betGroup": {
                                "id": 1,
                                "typeID": 1,
                                "groupings": [
                                    1,
                                    36
                                ],
                                "classificationId": 1,
                                "name": "Match Winner",
                                "displayName": "Match Winner",
                                "unitName": ""
                            },
                            "event": {
                                "id": 663795,
                                "name": "Arsenal - Ajax",
                                "displayName": null
                            },
                            "category": {
                                "id": 1,
                                "name": "Football"
                            },
                            "region": {
                                "name": "European cups"
                            },
                            "subCategory": {
                                "id": 166,
                                "name": "UEFA Champions League"
                            },
                            "displayName": null,
                            "helpText": null,
                            "count": 26,
                            "resultString": "",
                            "presentationType": 0,
                            "participants": [],
                            "hcpDisplayString": "",
                            "startingPitcherDisplayString": "",
                            "betgroupBetSlipDisplayString": "",
                            "groupingName": "",
                            "isLive": 0,
                            "isTv": 0
                        },
                        "sortorder": 1,
                        "selectionGroup": 0,
                        "participantID": 0,
                        "subparticipantID": 0,
                        "repositoryItemID": 1,
                        "name": "1",
                        "displayName": "1",
                        "subparticipantName": "",
                        "odds": 1.51,
                        "status": 1,
                        "statusText": "test",
                        "voidReasonID": 0,
                        "voidReasonText": null
                    }],
                    "status": 1,
                    "merchantBetId": 0,
                    "betType": 1,
                    "payout": 0
                }],
                "rejectedAmount": 0,
                "grantedAmount": 0,
                "originalAmount": 0,
                "couponType": 0,
                "potentialWin": 0,
                "totalWon": 0,
                "latestDeadline": new Date('Fri Jan 29 2016 04:45:00 GMT+0100 (W. Europe Standard Time)'),
                "betStatus": 'test'
            }
        };

        expect(adapter.toBetHistoryDetails(original, translationKeysByBetStatus)).toEqual(formatted);
    });
});
