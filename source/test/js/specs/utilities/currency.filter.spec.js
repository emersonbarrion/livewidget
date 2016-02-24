describe("Filter: Currency", function () {

    var filter, applicationState;

    beforeEach(module('angular-sitestack-currency'));

    beforeEach(inject([
        "$filter", "applicationState", function ($filter, _applicationState_) {
            applicationState = _applicationState_;
            filter = $filter("sskCurrency");            
        }
    ]));

    it("should format currency values", function () {

        var data = {
            "$$state": {
                "value": {
                    isAuthenticated: true,
                    details: {
                        currencySymbolUnicode: 24
                    }
                }
            }
        };

        spyOn(applicationState, "user").and.returnValue(data);

        expect(filter(10000, "£")).toBe("£10,000.00");
        expect(filter(10000)).toBe("$10,000.00");
        expect(filter(10000, "£", 0)).toBe("£10,000");

        data.$$state.value.details.currencySymbolUnicode = "Y";
        expect(filter(10000).endsWith("10,000.00")).toBe(true);
    });
});