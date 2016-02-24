(function (angular) {
    "use strict";

    angular
        .module("sportsbook.betslip")
        .provider("couponViewModel", function () {
            
            var CouponViewModelFactory = function (ctor) {
                Object.defineProperty(this, "ctor", { "value": ctor });
            };

            CouponViewModelFactory.prototype.create = function (initialData) {
                return new this.ctor(initialData);
            };

            this.$get = ["singleCouponViewModelFactory", "combiCouponViewModelFactory", "systemCouponViewModelFactory", "couponTypes", function (singles, combi, system, types) {

                var repo = {};
                repo[types.single] = new CouponViewModelFactory(singles);
                repo[types.combi] = new CouponViewModelFactory(combi);
                repo[types.system] = new CouponViewModelFactory(system);

                var availableKeys = _.chain(repo).keys().map(function (k) { return parseInt(k); }).value();

                return {
                    byType: function (type) {

                        if (!_.contains(availableKeys, type)) {
                            throw "Unkown coupon type: " + type;
                        }

                        return repo[type];
                    }
                };
            }];
            
    });

}(window.angular));