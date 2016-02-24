describe("Provider: Catalogue", function () {

    var provider, service;

    beforeEach(module("sportsbook.catalogue"));

    beforeEach(inject(["catalogue", "catalogueService", function (catalogue, catalogueService) {
        service = catalogueService;
        provider = catalogue;
    }]));

    it("Should proxy calls to the service", function () {

        _.each(_.functions(provider), function (name) {

            spyOn(service, name).and.returnValue(true);

            expect(provider[name]()).toBe(true);
            expect(service[name]).toHaveBeenCalled();
        });
    });
});