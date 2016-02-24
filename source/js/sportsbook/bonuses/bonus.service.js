(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.bonuses");

    module.service("bonusService", ["$http", "$rootScope", "sitestackApiConfig", "sportsbookConfiguration", "applicationState", "apiConfig", "lodash", "CacheFactory", "prematchSession", "$log", "$q", function ($http, $rootScope, sitestackApiConfig, sportsbookConfiguration, applicationState, apiConfig, _, CacheFactory, prematchSession, logger, $q) {
        var self = this;
        self.apiConfig = apiConfig;
        self.$http = $http;
        self.$q = $q;
        self.$rootScope = $rootScope;
        self.bonuses = {};
        self.prematchSession = prematchSession;
        self.applicationState = applicationState;

        var cache = CacheFactory.get(sportsbookConfiguration.cachePrefix + ".cache.sb.bonuses");

        self.getAvailableBonuses = function () {
            var self = this;

            return self.applicationState.user().then(function (user) {
                if (!user.isAuthenticated) {
                    return null;
                }

                return self.prematchSession.getSessionInfo().then(function (sessionInfo) {
                    var options = {
                        matchType: 0,
                        Channel: 1,
                        sessionId: sessionInfo.token,
                        segmentId: sessionInfo.segmentId
                    };

                    return self.apiConfig.directUrlFor({
                            path: "/bonus"
                        })
                        .then(function (url) {
                            return self.$http({
                                method: "GET",
                                params: options,
                                url: url,
                                cache: cache
                            }).then(function (response) {
                                return response.data;
                            }, function (err) {
                                logger.error("Failed to load bonuses - ", err);
                                return null;
                            });
                        });
                }, function (err) {
                    logger.error("Failed to load sessionInfo", err);
                });
            });

        };

        self.isLiveSelection = function (selection) {
            return selection.isLive === true;
        };

        self.isPrematchSelection = function (selection) {
            return selection.isLive === false;
        };

        self.isOnlyAvailableForLive = function (bonus) {
            return bonus.bonusMatchType === 2;
        };

        self.isOnlyAvailableForPrematch = function (bonus) {
            return bonus.bonusMatchType === 1;
        };

        self.checkBonus = function (selections) {
            var categoryIds = _.chain(selections).pluck("categoryId").uniq().value();
            var subCategoryIds = _.chain(selections).pluck("subCategoryId").uniq().value();
            var eventIds = _.chain(selections).pluck("eventId").uniq().value();

            return self.getAvailableBonuses().then(function (bonuses) {
                if (_.isEmpty(bonuses)) {
                    return [];
                }
                return bonuses.customerBonuses;
            }).then(function (customerBonuses) {

                if (_.any(selections, self.isLiveSelection)) {
                    _.remove(customerBonuses, self.isOnlyAvailableForPrematch);
                }

                if (_.any(selections, self.isPrematchSelection)) {
                    _.remove(customerBonuses, self.isOnlyAvailableForLive);
                }

                var isEventBonusInSelections = function (bonus) {
                    return (bonus && bonus.bonusData && _.includes(eventIds, bonus.bonusData.eventid));
                };

                var isCategoryBonusInSelections = function (bonus) {
                    return (bonus && bonus.bonusData && _.includes(categoryIds, bonus.bonusData.categoryId));
                };

                var isSubCategoryBonusInSelections = function (bonus) {
                    return (bonus && bonus.bonusData && (_.intersection(subCategoryIds, bonus.bonusData.subCategoryIds)).length > 0);
                };

                var isDefaultBonus = function (bonus) {
                    if (!_.isEmpty(categoryIds) || !_.isEmpty(subCategoryIds) || !_.isEmpty(eventIds)) {
                        return bonus && bonus.bonusData === null;
                    }
                };

                var eventBonus = _.filter(customerBonuses, isEventBonusInSelections);
                var categoryBonus = _.filter(customerBonuses, isCategoryBonusInSelections);
                var subCategoryBonus = _.filter(customerBonuses, isSubCategoryBonusInSelections);
                var defaultBonus = _.filter(customerBonuses, isDefaultBonus);

                if (defaultBonus.length > 0 || eventBonus.length > 0 || categoryBonus.length > 0 || subCategoryBonus.length > 0) {
                    return defaultBonus.concat(eventBonus, categoryBonus, subCategoryBonus);
                }

                return [];
            });
        };
    }]);
}(angular));