(function (angular) {
    "use strict";

    var CACHE_KEY = "ssk.cache.sb.promotions.market-promotion";

    function MarketPromotionService(marketPromotionResource, applicationState, eventDataSourceManager, catalogue, CacheFactory, $q, $log) {
        this.dependencies = {};
        this.dependencies.resource = marketPromotionResource;
        this.dependencies.state = applicationState;
        this.dependencies.eventsManager = eventDataSourceManager;
        this.dependencies.catalogue = catalogue;
        this.dependencies.cache = CacheFactory.get(CACHE_KEY);
        this.dependencies.$q = $q;
        this.dependencies.$log = $log;
    }

    /**
     * Method to convert a raw banner center model to a market promotion view model.
     * @param  {Object} data The raw banner center model.
     * @return {Object}      The mapped view model.
     */
    MarketPromotionService.prototype.toViewModel = function (data) {
        var self = this;
        var eventsManager = self.dependencies.eventsManager;

        if (!data) {
            return null;
        }

        var bannerViewModel = {
            "type": data.type || "",
            "url": data.url || "",
            "img": data.img || "",
            "content": data.content || "",
            "languageCode": data.languageCode || "",
            "meta": data.meta || {}
        };

        if (!data.meta || !data.meta.event) {
            return bannerViewModel;
        }

        var eventId = Number(data.meta.event);

        if (!eventId || _.isNaN(eventId)) {
            return bannerViewModel;
        }

        return eventsManager.createGenericEventListDataSource("marketPromotionEvents", {
            "eventIds": [eventId]
        }).then(function (marketPromotionEvents) {
            if (!marketPromotionEvents || marketPromotionEvents.content.length === 0) {
                return bannerViewModel;
            }
            var eventModel = marketPromotionEvents.content[0];
            return self.mergeEventData(bannerViewModel, eventModel);
        });
    };


    MarketPromotionService.prototype.mergeEventData = function (viewModel, eventModel) {
        var self = this;
        var catalogue = self.dependencies.catalogue;
        var $q = self.dependencies.$q;


        // update the view model
        viewModel.meta.event = eventModel;
        viewModel.meta.competition = eventModel.subCategory || {
            "id": Number(viewModel.meta.competition)
        };
        viewModel.meta.region = eventModel.region;
        viewModel.meta.category = eventModel.category;
        if (viewModel.meta.market) {
            viewModel.meta.market = _.find(eventModel.getMarkets(), {
                "id": Number(viewModel.meta.market)
            });
        }

        // Add additional category, region and competition information
        return $q.all({
            category: _.has(viewModel.meta.category, "id") ? catalogue.getCategory({
                "id": viewModel.meta.category.id
            }) : false,
            region: _.has(viewModel.meta.region, "id") ? catalogue.getRegion({
                "id": viewModel.meta.region.id
            }) : false,
            competition: _.has(viewModel.meta.competition, "id") ? catalogue.getCompetition({
                "id": viewModel.meta.competition.id
            }) : false
        }).then(function (params) {
            viewModel.meta.category = params.category || viewModel.meta.category;
            viewModel.meta.region = params.region || viewModel.meta.region;
            viewModel.meta.competition = params.competition || viewModel.meta.competition;

            if (viewModel.meta.competition.slug) {
                if (eventModel.isLive) {
                    viewModel.url = viewModel.meta.competition.liveSlug + "/" + eventModel.shortName;
                } else {
                    viewModel.url = viewModel.meta.competition.slug + "/" + eventModel.shortName;
                }

            }

            return viewModel;
        }).catch(function (err) {
            return viewModel;
        });
    };

    /**
     * gets the current market promotion.
     * @param  {String} area The banner center area to request.
     * @return {Promise}      [description]
     */
    MarketPromotionService.prototype.get = function (area) {
        var self = this;
        var $q = self.dependencies.$q;
        var $log = self.dependencies.$log;
        var cache = self.dependencies.cache;

        return $q.all({
            user: self.dependencies.state.user(),
            culture: self.dependencies.state.culture()
        }).then(function (state) {

            // Check if cached version exists for current authentication state
            var cacheKey = ["marketPromotion", area, state.culture.languageCode, state.user.isAuthenticated].join("_");
            var cachedMarketPromo = (cache) ? cache.get(cacheKey) : null;
            if (cachedMarketPromo) {
                return cachedMarketPromo;
            }

            // No cached version, so make a request to the API
            return self.dependencies.resource.get({
                "area": area,
                "language": state.culture.languageCode
            }).$promise.then(function (data) {
                if (_.isUndefined(data) || !data) {
                    return null;
                }
                data.languageCode = state.culture.languageCode;
                // Store the banner in cache
                cache.put(cacheKey, data);
                $log.debug("marketPromotionService: Stored", data, "in", cacheKey);
                return data;
            });
        }).then(function (raw) {
            return self.toViewModel(raw);
        });
    };

    angular
        .module("sportsbook.promotions")
        .service("marketPromotionService", ["marketPromotionResource", "applicationState", "eventDataSourceManager", "catalogue", "CacheFactory", "$q", "$log", MarketPromotionService]);

})(window.angular);
