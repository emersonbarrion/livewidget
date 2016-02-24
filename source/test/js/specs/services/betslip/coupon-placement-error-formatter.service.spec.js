describe("Service: Coupon placement error formatter", function () {
    var couponPlacementErrorFormatter;

    beforeEach(module("sportsbook.betslip", ["couponPlacementErrorFormatterProvider", function (couponPlacementErrorFormatterProvider) {
        couponPlacementErrorFormatterProvider.errorConfigurationByCode = {
            "1": {
                key: "test.error.1"
            },
            "2": {
                key: "test.error.2",
                options: {
                    param: 1
                }
            }
        };
    }]));

    beforeEach(inject(["couponPlacementErrorFormatter", function (_couponPlacementErrorFormatter_) {
        couponPlacementErrorFormatter = _couponPlacementErrorFormatter_;
    }]));

    it("should fall back to a general error if it does not have a key for a given error code.", function () {
        var formattedErrors = couponPlacementErrorFormatter.format([{
            code: "3"
        }]);

        expect(formattedErrors).toEqual([{
            code: "3",
            key: null,
            params: {},
            options: null
        }]);
    });

    it("should attach parameters specified in the configuration to an error code.", function () {
        var formattedErrors = couponPlacementErrorFormatter.format([{
            code: "2"
        }]);

        expect(formattedErrors).toEqual([{
            code: "2",
            key: "test.error.2",
            params: {},
            options: {
                param: 1
            }
        }]);
    });
});