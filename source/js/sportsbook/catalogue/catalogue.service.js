(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.catalogue');

    // declare the default MarketsService class
    var CatalogueServiceClass = function ($q, $http, CacheFactory, catalogueResource, applicationState, _, $log, lazyPromiseFactory) {
        // store the injected dependencies
        this.$q = $q;
        this.$http = $http;
        this.CacheFactory = CacheFactory;
        this.applicationState = applicationState;
        this.resource = catalogueResource;
        this._ = _;
        this.$log = $log;

        // cache keys
        this.cache = CacheFactory.get("ssk.cache.sb.catalogue");
        this._eventMapPromisesByPhaseAndCulture = {};
        this._menuPromisesByPhaseAndCulture = {};
        this.lazyPromiseFactory = lazyPromiseFactory;
    };

    CatalogueServiceClass.prototype._slugCriteria = function (options, type) {
        // TODO Maybe get this directly from params
        var slug = "/" + options.category;
        if (type === "region" || type === "competition") {
            slug += (options.region ? "/" + options.region : "");
        }
        if (type === "competition") {
            slug += (options.competition ? "/" + options.competition : "");
        }

        return {
            "criteria": function (entry) {
                return entry[type].slug.indexOf(slug, entry[type].slug.length - slug.length) !== -1;
            },
            "type": type
        };
    };

    CatalogueServiceClass.prototype._idCriteria = function (options, type) {
        return {
            "criteria": function (entry) {
                return entry[type].id === options.id;
            },
            "type": type
        };
    };

    CatalogueServiceClass.prototype._getNode = function (options, type) {
        var self = this;
        var $log = self.$log;
        var result = self.$q.defer();

        var filter = (options.id) ? self._idCriteria(options, type) : self._slugCriteria(options, type);
        options.phase = options.phase || 0;

        self.getEventMap({
            phase: options.phase
        }).then(function (map) {
            var node = self._search(map, filter);

            if (node) {
                result.resolve(node);
            } else {
                result.reject({
                    "message": "Could not find " + type,
                    "parameters": options,
                    "errorCode": 404
                });
            }

        }, function (rejection) {
            $log.error(rejection);
            result.reject(rejection);
        });

        return result.promise;
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getCategory
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {object} options - The request parameters.
     * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category name.
     * @param {string} options.category - The string representation of the category to retrieve
     * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns the category prematch items
     */
    CatalogueServiceClass.prototype.getCategory = function (options) {
        return this._getNode(options, "category");
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getRegion
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {object} options - The request parameters.
     * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category and region names.
     * @param {string} options.category - The string representation of the category to retrieve
     * @param {string} options.region - The string representation of the region to retrieve
     * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns the category prematch items
     */
    CatalogueServiceClass.prototype.getRegion = function (options) {
        return this._getNode(options, "region");
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getCompetition
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {object} options - The request parameters.
     * @param {number} options.id - The id of the item to retrieve. If this is present, it will be used in preference to the category, region and competition names.
     * @param {string} options.category - The string representation of the category to retrieve
     * @param {string} options.region - The string representation of the region to retrieve
     * @param {string} options.competition - The string representation of the competition to retrieve
     * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns the category prematch items
     */
    CatalogueServiceClass.prototype.getCompetition = function (options) {

        return this._getNode(options, "competition");
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getCompetitionById
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {array} ids - An array of Ids of the competition which will be searched for.
     * @param {object=} options - Optional parameters.
     * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns a list of competition elements from the prematch menu tree if found, else empty array.
     */
    CatalogueServiceClass.prototype.getCompetitionsById = function (ids, options) {

        var self = this;
        var result = self.$q.defer();

        options = options || {};
        options.phase = options.phase || 0;

        if (!_.isArray(ids)) {
            result.reject("The ids parameter should be an array of numeric values");
        } else {
            self.getEventMap(options).then(function (map) {

                // Grab a copy of each competition.
                var competitions = _.compact(_.map(ids, function (id) {
                    return self._search(map, {
                        "criteria": {
                            "competition": {
                                "id": parseInt(id)
                            }
                        },
                        "type": "competition"
                    });
                }));

                result.resolve(competitions);
            });
        }

        return result.promise;
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#_search
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {object} map - The catalogue/event map.
     * @param {object} filter - The element to return.
     * @param {string} filter.type - The type of the element that should be returned.
     * @description Returns the element from the prematch menu tree matching the type and properties in the source, else undefined.
     */
    CatalogueServiceClass.prototype._search = function (map, filter) {

        if (!map || !filter) {
            return undefined;
        }

        var item = _.find(map, filter.criteria);

        if (!item) {
            return undefined;
        }

        var copy = this._copy(item[filter.type]);

        // TODO - Don't like this, we should look at returning the actual tree.

        if (filter.type === "competition") {
            copy.parent = this._copy(item.region);
            copy.root = this._copy(item.category);
        }

        if (filter.type === "region") {
            copy.parent = this._copy(item.category);
            copy.root = this._copy(item.category);
        }

        return copy;
    };

    CatalogueServiceClass.prototype._copy = function (element) {

        if (_.isArray(element)) {
            return _.sortBy(
                _.map(element, function (individualElement) {
                    return this._copy(individualElement);
                }, this),
                "sortOrder");
        }

        var shallowCopiedElement = _.merge({}, element);
        shallowCopiedElement.children = [];

        return shallowCopiedElement;
    };


    /**
     * @ngdoc method
     * @deprecated
     * @name sportsbook.catalogue.catalogueService#getCategories
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {number=} phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns the categories in the navigation menu
     */
    CatalogueServiceClass.prototype.getCategories = function (phase) {
        var self = this;
        phase = phase || 0;

        return self.applicationState.culture().then(function (culture) {
            var cacheKey = [culture.languageCode, phase].join('_');

            if (!self._menuPromisesByPhaseAndCulture[cacheKey]) {
                self._menuPromisesByPhaseAndCulture[cacheKey] = new self.lazyPromiseFactory(
                    function () {
                        return self.resource.query(culture, phase).then(function (rawCategories) {
                            // SSK-1031 Filter Menu with Live Data - to not show items that we don't have data for
                            _.remove(rawCategories, function (category) {
                                _.remove(category.children, function (region) {
                                    _.remove(region.children, function (competition) {
                                        return _.isEmpty(competition.children);
                                    });
                                    return _.isEmpty(region.children);
                                });
                                return _.isEmpty(category.children);
                            });
                            return rawCategories;
                        });
                    }
                );
            }

            return self._menuPromisesByPhaseAndCulture[cacheKey];

        });
    };

    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getMenu
     * @methodOf sportsbook.catalogue.catalogueService
     * @param {number=} phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     * @description Returns the navigation menu prematch items
     */
    CatalogueServiceClass.prototype.getMenu = CatalogueServiceClass.prototype.getCategories;


    /**
     * @ngdoc method
     * @name sportsbook.catalogue.catalogueService#getEventMap
     * @methodOf sportsbook.catalogue.catalogueService
     * @description
     * Returns an object mapping events to categories, regions and competitions.
     *
     * @param {object=} options - Optional parameters
     * @param {number=} options.phase - The event phase (1 = prematch, 2 = live, 0 = all [default])
     */
    CatalogueServiceClass.prototype.getEventMap = function (options) {
        var self = this;

        if (_.isUndefined(options)) {
            options = {};
        }

        options = _.defaultsDeep(options, {
            "phase": 0
        });

        return self.applicationState.culture().then(function (culture) {
            // read the value from the cache
            var phase = options.phase;
            var cacheKey = [culture.languageCode, phase].join('_');

            if (!self._eventMapPromisesByPhaseAndCulture[cacheKey]) {
                self._eventMapPromisesByPhaseAndCulture[cacheKey] = new self.lazyPromiseFactory(
                    function () {

                        return self.getMenu(phase).then(function (menu) {
                            return _.flatten(_.map(menu, function (category) {
                                return _.map(category.children, function (region) {
                                    return _.map(region.children, function (competition) {
                                        return _.map(competition.children, function (evt) {
                                            return {
                                                "event": evt,
                                                "competition": competition,
                                                "region": region,
                                                "category": category
                                            };
                                        });
                                    });
                                });
                            }), true);
                        });

                    }
                );
            }

            return self._eventMapPromisesByPhaseAndCulture[cacheKey];
        });
    };

    /**
     * @ngdoc service
     * @name sportsbook.catalogue.catalogueService
     * @description catalogue factory to be consumed by the catalogueProvider
     */
    module.service("catalogueService", ["$q", "$http", "CacheFactory", "catalogueResource", "applicationState", "lodash", "$log", "lazyPromiseFactory", CatalogueServiceClass]);
}(window.angular));
