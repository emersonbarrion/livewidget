describe("Wrapper: eqjs Element Queries", function () {

    var eqjsUtils;

    beforeEach(module("angular-sitestack-modules"));

    beforeEach(inject(["eqjsUtils", function (_eqjsUtils_) {
        eqjsUtils = _eqjsUtils_;
    }]));

    it("Should delegate calls to eqjs", function() {

        spyOn(eqjs, "query");

        var callback = function () { };

        var nodes = ["test"];
        eqjsUtils.query(nodes, callback);

        expect(eqjs.query).toHaveBeenCalledWith(nodes, callback);
    });

    it("Should select elements for the given nodes", function () {

        expect(eqjsUtils.find().length).toBe(0);

        var nodes = [
            { id: 1, querySelector: function () { return this; } },
            { id: 2, querySelector: function () { return null; } },
            { id: 3, querySelector: function () { return this; } }
        ];

        var selections = eqjsUtils.find(nodes);
        expect(selections[0]).toBe(nodes[0]);
        expect(selections[1]).toBe(nodes[2]);
    });
});