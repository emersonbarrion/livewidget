(function (angular, slug) {
    "use strict";

    var Isa2AdapterClass = (function () {

        var dependencies = {};

        function Isa2AdapterClass(lodash, catalogueMapping, $q, $log) {
            dependencies.lodash = lodash;
            dependencies.catalogueMapping = catalogueMapping;
            dependencies.$q = $q;
            dependencies.$log = $log;
        }

        Isa2AdapterClass.$inject = ["lodash", "catalogueMappings", "$q", "$log"];

        Isa2AdapterClass.prototype.toCategory = function (parent, data) {
            var _ = dependencies.lodash;
            var $log = dependencies.$log;
            var self = this;

            if (_.isArray(data)) {
                var catalogueData = _.chain(data).map(function (element) {
                    return self.toCategory(parent, element);
                }).compact().value();

                return dependencies.$q.all(catalogueData);
            }

            return dependencies.catalogueMapping.byId(data.ci).then(function (categoryDefinition) {
                if (_.isUndefined(categoryDefinition)) {
                    $log.warn("Catalogue adapter warning: Rejecting category id " + data.ci + " - category id is not defined in catalogueMappings", data);
                    return null;
                }

                var category = {
                    "id": data.ci,
                    "name": data.cn,
                    "marketCount": data.mc,
                    "parentId": 0,
                    "type": "Category",
                    "iconHint": categoryDefinition.iconHint,
                    "slug": ["", parent.languageCode, slug(data.cn)].join("/"),
                    "liveSlug": ["", parent.languageCode, "live", slug(data.cn)].join("/"),
                    "checked": false,
                    "isSelected": false
                };

                // Support the old model until the next version is rolled out.
                if (data.so) {
                    category.sortOrder = data.so;
                }
                // End of compatibility block - remove before end of sprint 18

                if (data.sr) {
                    category.sortRank = {
                        "defaultSortOrder": data.sr.dso,
                        "popularityRank": data.sr.pbbpoe
                    };
                }

                category.children = self.toRegion(category, data.rl);

                category.hasLiveEvents = _.some(category.children, {
                    "hasLiveEvents": true
                });

                category.eventCount = _.sum(category.children, "eventCount");

                return category;
            });
        };

        Isa2AdapterClass.prototype.toRegion = function (parent, data) {

            var _ = dependencies.lodash;

            if (_.isArray(data)) {
                return _.map(data, function (element) {
                    return this.toRegion(parent, element);
                }, this);
            }

            var region = {
                "id": data.ri,
                "name": data.rn,
                "marketCount": data.mc,
                "parentId": parent.id,
                "type": "Region",
                "slug": [parent.slug, slug(data.rn)].join("/"),
                "liveSlug": [parent.liveSlug, slug(data.rn)].join("/"),
                "checked": false,
                "isSelected": false
            };

            // Support the old model until the next version is rolled out.
            if (data.so) {
                region.sortOrder = data.so;
            }
            // End of compatibility block - remove before end of sprint 18

            if (data.sr) {
                region.sortRank = {
                    "defaultSortOrder": data.sr.dso,
                    "popularityRank": data.sr.pbbpoe
                };
            }

            region.children = this.toCompetition(region, data.scl);

            region.hasLiveEvents = _.some(region.children, {
                "hasLiveEvents": true
            });

            region.eventCount = _.sum(region.children, "eventCount");

            return region;
        };

        Isa2AdapterClass.prototype.toCompetition = function (parent, data) {

            var _ = dependencies.lodash;

            if (_.isArray(data)) {
                return _.map(data, function (element) {
                    return this.toCompetition(parent, element);
                }, this);
            }

            // retrieve the statistics external id
            var externalId = _.find(data.sl, function (item) {
                return item.st === 3 && item.sp === 3; // statistics && score 24
            });

            var competition = {
                "id": data.sci,
                "name": data.scn,
                "marketCount": data.mc,
                "eventCount": (data.el) ? data.el.length : 0,
                "type": "Competition",
                "slug": [parent.slug, data.scn ? slug(data.scn) : "null"].join("/"),
                "liveSlug": [parent.liveSlug, data.scn ? slug(data.scn) : "null"].join("/"),
                "parentId": parent.id,
                "checked": false,
                "isSelected": false,
                "externalId": externalId ? externalId.si : null
            };

            // Support the old model until the next version is rolled out.
            if (data.so) {
                competition.sortOrder = data.so;
            }
            // End of compatibility block - remove before end of sprint 18

            if (data.sr) {
                competition.sortRank = {
                    "defaultSortOrder": data.sr.dso,
                    "popularityRank": data.sr.pbbpoe
                };
            }

            competition.children = (data.el) ? this.toEvent(competition, data.el) : 0;

            competition.hasLiveEvents = _.some(competition.children, {
                "isLive": true
            });

            return competition;
        };

        Isa2AdapterClass.prototype.toEvent = function (parent, data) {

            var _ = dependencies.lodash;

            if (_.isArray(data)) {
                return _.map(data, function (element) {
                    return this.toEvent(parent, element);
                }, this);
            }

            // Support the old model until the next version is rolled out.
            if (typeof (data) === "number") {
                return data;
            }
            // End of compatibility block - remove before end of sprint 18

            return {
                "id": data.ei,
                "startDate": new Date(data.sd),
                "marketCount": data.mc,
                "isLive": (data.cep === 2)
            };
        };

        return Isa2AdapterClass;
    }());

    angular.module('sportsbook.catalogue').service("catalogueAdapter", Isa2AdapterClass);
}(window.angular, window.slug));
