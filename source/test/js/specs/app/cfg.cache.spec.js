describe("Configuration: Caches", function() {

    var cache;

    beforeEach(module("sportsbook"));

    beforeEach(inject(['CacheFactory', function(cacheFactory) {
        cache = cacheFactory.get("ssk.cache.sb.resource");
    }]));

    beforeEach(function(done) {
        done();
    });

    it("Should set configuration", function(done) {
        expect(cache.$$maxAge).toBe(60000);
        expect(cache.$$deleteOnExpire).toBe("aggressive");
        expect(cache.$$storageMode).toBe("memory");
        done();
    });

    it("Should log keys when they expire", function(done) {
        cache.$$maxAge = 10;

        spyOn(console, "log").and.callFake(function() {
            expect(console.log).toHaveBeenCalledWith("Expired key: key");
            done();
        });

        cache.put("key", "test");
    });
});
