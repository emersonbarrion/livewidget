describe("Service: Coupon Validation", function () {

    var service, datasource, $rootScope, betslip;

    beforeEach(module('angular-sitestack-utilities'));
    beforeEach(module('sportsbook.betslip'));
    beforeEach(module("sportsbook.validations", [
        "couponValidationProvider",
        function (couponValidationProvider) {
            couponValidationProvider.messageKeyByRuleId = {
                "default": "defaultError"
            };
        }
    ]));

    beforeEach(inject(["couponValidation", function (_couponValidation_) {
        service = _couponValidation_;
    }]));

    beforeEach(inject(["eventsResource", "eventDataSourceManager", "$rootScope", "$q", "betslip", "applicationState",
        function (eventsResource, eventDataSourceManager, _$rootScope_, _$q_, _betslip_, applicationState) {
            $q = _$q_;
            betslip = _betslip_;
            spyOn(_betslip_, '_checkForBonuses').and.returnValue(_$q_.when({
                customerBonuses: [{
                    "customerBonusId": "7df4f971-51d9-43fb-852a-b22aaa0a7405",
                    "bonusType": "RFB",
                    "createdDate": "01/20/2015 13:37:02",
                    "expiryDate": "01/20/2015 13:37:02",
                    "bonusCriteria": 4,
                    "bonusMatchType": 0,
                    "stake": 10.0,
                    "bonusData": null
                }]
            }));
            spyOn(eventsResource, "query").and.returnValue({
                $promise: $q.when()
            });

            spyOn(applicationState, "user").and.returnValue($q.when({
                "isAuthenticated": false
            }));

            eventDataSourceManager.createVariableSelectionListDataSource("test").then(function (_datasource_) {
                datasource = _datasource_;
            });

            $rootScope = _$rootScope_;
        }
    ]));

    beforeEach(function (done) {
        betslip.initialise().then(function () {
            betslip.convertTo(1);
            done();
        });
        $rootScope.$digest();
    });

    it("should default to 'no restriction' if a rule does not define an assert function", function () {

        spyOn(Sportsbook.Rules.NoRestriction, "assert").and.callThrough();

        Sportsbook.Rules.Repository = [{}];

        var selection = {
            id: 2,
            odds: 2.0,
            marketId: 11,
            ruleId: 0,
            getParent: function () {
                return {
                    "id": 11
                };
            }
        };

        betslip.add(selection);

        service.validate(betslip);
        expect(Sportsbook.Rules.NoRestriction.assert).toHaveBeenCalled();
    });

    it("should accept any combination of single bet", function () {
        Sportsbook.Rules.Repository = [{
            assert: function () {}
        }, {
            assert: function () {}
        }];

        spyOn(Sportsbook.Rules.Repository[0], "assert");
        spyOn(Sportsbook.Rules.Repository[1], "assert");

        var selection1 = {
            id: 1,
            odds: 2.0,
            marketId: 10,
            ruleId: 0,
            getParent: function () {
                return {
                    "id": 10
                };
            }
        };
        var selection2 = {
            id: 2,
            odds: 2.0,
            marketId: 11,
            ruleId: 1,
            getParent: function () {
                return {
                    "id": 11
                };
            }
        };

        var selectionX = {
            id: 6,
            odds: 2.0,
            marketId: 10,
            ruleId: 0,
            getParent: function () {
                return {
                    "id": 10
                };
            }
        };

        betslip.convertTo(0);

        betslip.add(selection1);
        betslip.add(selection2);

        service.validate(betslip);

        expect(Sportsbook.Rules.Repository[0].assert).not.toHaveBeenCalled();
        expect(Sportsbook.Rules.Repository[1].assert).not.toHaveBeenCalled();

        service.testSelection(selectionX, betslip);
        expect(Sportsbook.Rules.Repository[0].assert).not.toHaveBeenCalled();
        expect(Sportsbook.Rules.Repository[1].assert).not.toHaveBeenCalled();
    });

    it("should apply rules based on the rule id", function () {
        Sportsbook.Rules.Repository = [{
            assert: function () {}
        }, {
            assert: function () {}
        }, {
            assert: function () {}
        }, {
            assert: function () {}
        }, {
            assert: function () {}
        }];

        spyOn(Sportsbook.Rules.Repository[0], "assert").and.returnValue({
            passed: true
        });
        spyOn(Sportsbook.Rules.Repository[1], "assert").and.returnValue({
            passed: true
        });
        spyOn(Sportsbook.Rules.Repository[2], "assert").and.returnValue({
            passed: true
        });
        spyOn(Sportsbook.Rules.Repository[3], "assert").and.returnValue({
            passed: true
        });
        spyOn(Sportsbook.Rules.Repository[4], "assert").and.returnValue({
            passed: true
        });

        var selection1 = {
            id: 1,
            ruleId: 0,
            odds: 2.0,
            marketId: 10,
            getParent: function () {
                return {
                    "id": 10
                };
            }
        };
        var selection2 = {
            id: 2,
            ruleId: 1,
            odds: 2.0,
            marketId: 11,
            getParent: function () {
                return {
                    "id": 11
                };
            }
        };
        var selection3 = {
            id: 3,
            ruleId: 2,
            odds: 2.0,
            marketId: 12,
            getParent: function () {
                return {
                    "id": 12
                };
            }
        };
        var selection4 = {
            id: 4,
            ruleId: 3,
            odds: 2.0,
            marketId: 13,
            getParent: function () {
                return {
                    "id": 13
                };
            }
        };
        var selection5 = {
            id: 5,
            ruleId: 4,
            odds: 2.0,
            marketId: 14,
            getParent: function () {
                return {
                    "id": 14
                };
            }
        };

        var selectionX = {
            id: 6,
            ruleId: 0,
            odds: 2.0,
            marketId: 10,
            getParent: function () {
                return {
                    "id": 10
                };
            }
        };

        betslip.add(selection1);
        betslip.add(selection2);
        betslip.add(selection3);
        betslip.add(selection4);
        betslip.add(selection5);

        var selectionList = [selection1, selection2, selection3, selection4, selection5];

        service.validate(betslip);

        expect(Sportsbook.Rules.Repository[0].assert).toHaveBeenCalledWith(selectionList, selection1, "defaultError");
        expect(Sportsbook.Rules.Repository[1].assert).toHaveBeenCalledWith(selectionList, selection2, "defaultError");
        expect(Sportsbook.Rules.Repository[2].assert).toHaveBeenCalledWith(selectionList, selection3, "defaultError");
        expect(Sportsbook.Rules.Repository[3].assert).toHaveBeenCalledWith(selectionList, selection4, "defaultError");
        expect(Sportsbook.Rules.Repository[4].assert).toHaveBeenCalledWith(selectionList, selection5, "defaultError");

        service.testSelection(selectionX, betslip);
        expect(Sportsbook.Rules.Repository[0].assert).toHaveBeenCalledWith(selectionList, selection1, "defaultError");
        expect(Sportsbook.Rules.Repository[1].assert).toHaveBeenCalledWith(selectionList, selection2, "defaultError");
        expect(Sportsbook.Rules.Repository[2].assert).toHaveBeenCalledWith(selectionList, selection3, "defaultError");
        expect(Sportsbook.Rules.Repository[3].assert).toHaveBeenCalledWith(selectionList, selection4, "defaultError");
        expect(Sportsbook.Rules.Repository[4].assert).toHaveBeenCalledWith(selectionList, selection5, "defaultError");
    });

    it("should aggregate rule failures", function () {

        Sportsbook.Rules.Repository = [{}, {}, {
            assert: function () {}
        }, {
            assert: function () {}
        }];

        var calls2 = 0;
        var calls3 = 0;
        spyOn(Sportsbook.Rules.Repository[2], "assert").and.callFake(function () {

            calls2++;
            return {
                passed: false,
                violations: [calls2],
                affected: [calls2]
            };
        });

        spyOn(Sportsbook.Rules.Repository[3], "assert").and.callFake(function () {

            calls3++;
            return {
                passed: false,
                violations: [calls3],
                affected: [calls3]
            };
        });

        var selection1 = {
            id: 1,
            odds: 2.0,
            ruleId: 3,
            marketId: 10,
            getParent: function () {
                return {
                    "id": 10
                };
            }
        };
        var selection2 = {
            id: 2,
            odds: 2.0,
            ruleId: 3,
            marketId: 11,
            getParent: function () {
                return {
                    "id": 11
                };
            }
        };
        var selection3 = {
            id: 3,
            odds: 2.0,
            ruleId: 2,
            marketId: 12,
            getParent: function () {
                return {
                    "id": 12
                };
            }
        };

        betslip.add(selection1);
        betslip.add(selection2);
        betslip.add(selection3);

        var selections = [selection1, selection2, selection3];

        var result = service.validate(betslip);

        expect(Sportsbook.Rules.Repository[3].assert).toHaveBeenCalledWith(selections, selection1, "defaultError");
        expect(Sportsbook.Rules.Repository[3].assert).toHaveBeenCalledWith(selections, selection2, "defaultError");
        expect(Sportsbook.Rules.Repository[2].assert).toHaveBeenCalledWith(selections, selection3, "defaultError");

        // Numbers below reflect multiple calls to the validator as selections are added.
        expect(result.length).toBe(1);
        expect(result[0].passed).toBe(false);
        expect(result[0].violations.length).toBe(3);
        expect(result[0].violations[0]).toBe(6);
        expect(result[0].affected.length).toBe(3);
        expect(result[0].affected[0]).toBe(6);
    });
});
