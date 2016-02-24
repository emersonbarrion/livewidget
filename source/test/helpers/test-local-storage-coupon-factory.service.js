(function (angular) {
    function TestLocalStorageCouponFactory(couponTypes) {
        this.couponTypes = couponTypes;
    }

    TestLocalStorageCouponFactory.$inject = ["couponTypes"];

    TestLocalStorageCouponFactory.prototype.getLocalStorageCoupon = function (override) {
        override = override || {};

        var defaultLocalStorageCoupon = {
            type: this.couponTypes.single,
            data: this.getLocalStorageCouponData()
        };

        return _.defaults(override, defaultLocalStorageCoupon);
    };

    TestLocalStorageCouponFactory.prototype.getLocalStorageCouponData = function (listOfSelections) {
        var defaults = {
            eventId: 1,
            marketId: 1,
            betGroupId: 1
        };

        if (!listOfSelections) {
            listOfSelections = [{
                selectionId: 1
            }];
        }

        var finalOutput = {};

        _.forEach(listOfSelections, function (selection, index) {
            var defaultedSelection = _.merge({}, defaults, selection);

            if (!defaultedSelection.betslipOrder) {
                defaultedSelection.betslipOrder = index + 1;
            }

            var eventId = defaultedSelection.eventId;
            var marketId = defaultedSelection.marketId;
            var selectionId = defaultedSelection.selectionId;

            if (!finalOutput[eventId]) {
                finalOutput[eventId] = {
                    markets: {}
                };
            }

            var dataEvent = finalOutput[eventId];

            if (!dataEvent.markets[marketId]) {
                dataEvent.markets[marketId] = {
                    selections: {},
                    betGroupId: defaultedSelection.betGroupId,
                    betslipOrder: defaultedSelection.betslipOrder
                };
            }

            dataEvent.markets[marketId].selections[defaultedSelection.selectionId] = true;
        });

        return finalOutput;
    };


    TestLocalStorageCouponFactory.prototype.convertLocalStorageCouponToEventRequest = function (localStorageCoupon) {
        var eventIds = _.keys(localStorageCoupon.data);
        var betGroupIds = _.chain(localStorageCoupon.data).values().map("markets").map(function (obj) {
            return _.values(obj);
        }).flatten().map("betGroupId").unique().value();

        return {
            betGroupIds: betGroupIds,
            eventIds: eventIds,
            include: "scoreboard"
        };
    };

    angular.module("sportsbook.tests").service("testLocalStorageCouponFactory", TestLocalStorageCouponFactory);
})(window.angular);