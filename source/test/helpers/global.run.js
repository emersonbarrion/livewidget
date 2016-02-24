(function (angular) {
    angular.module("sportsbook.tests").run([
        "initialTestMarket", "applicationState", "$httpBackend", "testUrlBuilder", "testAuthenticationHelper", "globalEndpointMocks", "CacheFactory",
        function (initialTestMarket, applicationState, $httpBackend, testUrlBuilder, testAuthenticationHelper, globalEndpointMocks, CacheFactory) {
            //Clear cache
            CacheFactory.clearAll();

            //Start out logged out
            testAuthenticationHelper.logout();

            //Set the initial market to english
            applicationState.culture(initialTestMarket);

            //Set up global endpoint mocks.
            globalEndpointMocks.mockEndpoints();
        }
    ]);
})(window.angular);