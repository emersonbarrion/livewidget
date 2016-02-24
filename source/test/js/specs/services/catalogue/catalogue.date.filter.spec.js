
describe("Filter: Catalogue Date Filter", function () {
    var filter;

    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["$filter", function ($filter) {
        filter = $filter("catalogueDateFilter");
    }]));

    it("Should filter based on the given hour span", function () {
        var region1 = {
            "name": "Region 1",
            "type": "Region",
            "children": [{
                "type": "Competition",
                "children": [{
                    startDate: moment().add(10, "hours").toDate()
                }, {
                    startDate: moment().add(5, "hours").toDate()
                }]
            }]
        };

        var region2 = {
            "name": "Region 2",
            "type": "Region",
            "children": [{
                "type": "Competition",
                "children": [{
                    startDate: moment().add(20, "hours").toDate()
                }, {
                    startDate: moment().add(30, "hours").toDate()
                }]
            }]
        };

        var testRegions = [region1, region2];

        expect(filter(testRegions, null)).toEqual([region1, region2]);
        expect(filter(testRegions, 10)).toEqual([region1]);
        expect(filter(testRegions, 20)).toEqual([region1, region2]);
    });
});