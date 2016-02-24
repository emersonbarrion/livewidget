beforeEach(function () {
    var $injector = angular.injector(["angular-cache", "ng"]);
    var CacheFactory = $injector.get("CacheFactory");
    CacheFactory.destroyAll();
});