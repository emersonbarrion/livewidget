describe("Provider: Bets", function () {

    var provider, service;

    beforeEach(module('sportsbook.winnerList'));
    beforeEach(module('sportsbook.markets'));
    beforeEach(module('sportsbook.application'));
    beforeEach(module('sportsbook.bets'));
    beforeEach(module('sportsbook.session'));

    beforeEach(inject(["bets", "betsService", function (bets, betsService) {
        service = betsService;
        provider = bets;
    }]));

    it("Should proxy calls to the service", function () {

        _.each(_.functions(provider), function (name) {

            spyOn(service, name).and.returnValue(true);

            expect(provider[name]()).toBe(true);
            expect(service[name]).toHaveBeenCalled();
        });
    });
});