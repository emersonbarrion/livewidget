(function (angular) {
    "use strict";

    var sportsbookConfiguration = {
        'cachePrefix': 'ssk',
        'configurationVersion': 4,
        'preloadingConfigUrl': "/@@sourcePath/config/preloading/",
        'widgetConfiguration': "/@@sourcePath/config/",
        'homePageConfiguration': "/@@sourcePath/config/homepage/",
        'livePageConfiguration': "/@@sourcePath/config/livelobby/",
        "startingSoonConfiguration":"/@@sourcePath/config/startingsoon/",
        'categoryMappingSource': "/@@sourcePath/config/category-mappings.js",
        'clientInterfaceIdentifier': "1f6efdd0-d13f-44be-9a5a-ea6195cc885d",
        'templates': {
            'winnerListWidget': '/@@sourcePath/sportsbook/winner-list/winner-list-widget.html',
            'headToHeadListWidget': '/@@sourcePath/sportsbook/winner-list/head-to-head-list-widget.html',
            'winnerListSection': '/@@sourcePath/sportsbook/winner-list/winner-list-section.html',
            'betHistory': '/@@sourcePath/sportsbook/bethistory/bet-history.html',
            'betHistoryButton': '/@@sourcePath/sportsbook/bethistory/bet-history-button.html',
            'betSlip': '/@@sourcePath/sportsbook/bets/bet-slip.html',
            'manualAttest': '/@@sourcePath/sportsbook/bets/manual-attest.html',
            'catalogueList': '/@@sourcePath/sportsbook/catalogue/catalogue-list.html',
            'odds': '/@@sourcePath/sportsbook/directives/bsn-odds.html',
            'multipleEventsTable': '/@@sourcePath/sportsbook/events-table/multiple-events-table.html',
            'search': '/@@sourcePath/sportsbook/search/search.html',
            'searchResultWidget': '/@@sourcePath/sportsbook/views/search-result-widget.html',
            'statisticsEvent': '/@@sourcePath/sportsbook/statistics/statistics.html',
            'statisticsTable': '/@@sourcePath/sportsbook/statistics/statistics.table.html',
            'statisticsHeadToHead': '/@@sourcePath/sportsbook/statistics/statistics.headToHead.html',
            'statisticsFixtures': '/@@sourcePath/sportsbook/statistics/statistics.fixtures.html',
            'statisticsStandings': '/@@sourcePath/sportsbook/statistics/statistics.standings.html',
            'liveSimulationControlPanel': '/@@sourcePath/sportsbook/directives/live-simulation-control-panel.html',
            'marketPromotion': '/@@sourcePath/sportsbook/promotions/market-promotion-item.html',
            'liveStream': '/@@sourcePath/sportsbook/views/live-stream.html',
            'favorites': '/@@sourcePath/sportsbook/favorites/favorites-list.html',
            'favoritesButton': '/@@sourcePath/sportsbook/favorites/favorites-button.html'
        },
        'services': {
            'proxyUrl': "@@proxy-api-url",
            'bettingUrl': "@@betting-api-url",
            'isaUrl': "@@isa-api-url",
            'customerApi': '@@customer-api-url',
            'favoritesApi': '@@favorites-api-url'
        },
        'statistics': {
            'serviceUrl': "@@statistics-api-url",
            'apiKey': "oc950nV05957hj38}^P@14EC0%Q+{",
            'partner': "betsson"
        },
        'liveLobby': '@@liveLobby',
        'scoreBoardFormat': '/@@sourcePath/sportsbook/events-table/scoreboards/scoreboard-{sport}.html',
        'detailedScoreBoardFormat': '/@@sourcePath/sportsbook/views/scoreboards/scoreboard-{sport}.html',
        'marketSelections': {
            'marketTemplateFormat': '/@@sourcePath/sportsbook/markets/markets-{type}-widget.html',
            'widgetTemplateFormat': '/@@sourcePath/sportsbook/markets/{template}.html',
        },
        'maximumSystemBetSelections': 9,
        'maximumCombinationSelections': 20,
        'maximumSingleSelections': 0
    };

    var siteStackConfiguration = {
        'sskBusy': '/@@sourcePath/sitestack/utilities/ssk-busy.html',
        'promotions': "/promotions/",
        'translateRestLoader': '/i10n',
        'services': {
            'sessionInfo': '@@proxy-api-url/1/user/game/sportsbook-prematch/info',
            'proxyUrl': "@@proxy-api-url",
        },
        'routingConfiguration': '/@@sourcePath/config/routing/'
    };

    angular.module('sportsbook').config(["siteStackConfigurationProvider", "sportsbookConfigurationProvider", function (siteStackConfigurationProvider, sportsbookConfigurationProvider) {
        siteStackConfigurationProvider.config = siteStackConfiguration;
        sportsbookConfigurationProvider.config = sportsbookConfiguration;
    }]);

    /**
     * @ngdoc overview
     * @name demo.authentication
     */
    angular.module('demo.authentication', ['ng', "angular-sitestack-application"]);
    angular.module('demo.configuration', ["angular-cache"]);

    angular.module('sportsbook-app', [
        'angular-loading-bar',
        'demo.authentication',
        'sportsbook',
        'demo.configuration'
    ]);

    angular.module('sportsbook-app').config(['$provide', "$logProvider", function ($provide, $logProvider) {
        $provide.decorator('marketSelectionListViewModelAdapter', ['$delegate', 'sportsbookConfiguration', function ($delegate, sportsbookConfiguration) {
            var originalToWidget = $delegate.toWidget;

            $delegate.toWidget = function () {
                var widget = originalToWidget.apply($delegate, arguments);

                if (widget) {
                    widget.template = (widget.template) ? sportsbookConfiguration.marketSelections.widgetTemplateFormat.replace('{template}', widget.template) : null;
                }

                return widget;
            };

            var originalToMarket = $delegate.toMarket;

            $delegate.toMarket = function () {
                var market = originalToMarket.apply($delegate, arguments);

                if (market) {
                    market.template = (market.template) ? sportsbookConfiguration.marketSelections.marketTemplateFormat.replace("{type}", market.template) : null;
                }

                return market;
            };

            return $delegate;
        }]);

        $logProvider.debugEnabled(true);

    }]);

    angular.module("sportsbook-app").run(["userService", function (userService) {
        userService.init();
    }]);

}(window.angular));
