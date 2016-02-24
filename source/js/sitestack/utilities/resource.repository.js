
(function (angular) {
    "use strict";

    function ResourceRepository(diff) {
        this.diff = diff;
        this.resourcesById = {};
        this.dataSourcesByResourceId = {};
        this.resourceIdsByDataSource = {};
    }

    var getOrCreateResourceIdByDataSourceList = function (repository, dataSourceName) {
        // If we don't have one already, create a list to store ids associated with this data source.
        if (!repository.resourceIdsByDataSource[dataSourceName]) {
            repository.resourceIdsByDataSource[dataSourceName] = [];
        }
        return repository.resourceIdsByDataSource[dataSourceName];
    };

    var getOrCreateDataSourceByResourceIdList = function (repository, id) {
        // If we don't have one already, create a list to store data sources associated with this id.
        if (!repository.dataSourcesByResourceId[id]) {
            repository.dataSourcesByResourceId[id] = [];
        }
        return repository.dataSourcesByResourceId[id];
    };

    var attachResourceToDataSource = function (repository, dataSourceName, id) {
        var resourceKey = id;
        var dataSourcesForId = getOrCreateDataSourceByResourceIdList(repository, resourceKey);
        if (!_.contains(dataSourcesForId, dataSourceName)) {
            dataSourcesForId.push(dataSourceName);
        }
        var resourceIdsForDataSource = getOrCreateResourceIdByDataSourceList(repository, dataSourceName);
        if (!_.contains(resourceIdsForDataSource, id)) {
            resourceIdsForDataSource.push(id);
        }
    };

    var removeResourceFromDataSource = function (repository, dataSourceName, id) {
        var resourceKey = id;

        // Remove the resource from the list of resources managed by this dataSource.
        _.remove(repository.resourceIdsByDataSource[dataSourceName], function (i) {
            return i === id;
        });

        // Remove the data source from the list of data sources associated with this resource.
        _.remove(repository.dataSourcesByResourceId[resourceKey], function (d) {
            return d === dataSourceName;
        });

        // If the resource is no longer supported by any data source, remove it.
        var isOrphaned = _.isEmpty(repository.dataSourcesByResourceId[resourceKey]);

        if (isOrphaned) {
            delete repository.dataSourcesByResourceId[resourceKey];
            delete repository.resourcesById[resourceKey];
        }
    };

    // Higher-order function, useful for programming in the functional paradigm with lodash
    var getResourceById = function (respository) {
        return function (id) {
            return respository.resourcesById[id];
        };
    };

    ResourceRepository.prototype.removeDataSource = function (dataSourceName) {

        // If the data source is not registered, just return.
        if (!this.resourceIdsByDataSource[dataSourceName]) {
            return;
        }

        var self = this;
        var idsInDataSource = this.resourceIdsByDataSource[dataSourceName];

        while (idsInDataSource.length > 0) {
            removeResourceFromDataSource(self, dataSourceName, idsInDataSource[0]);
        }

        // We're done - eliminate the list of ids maintained by this data source.
        delete this.resourceIdsByDataSource[dataSourceName];
    };

    ResourceRepository.prototype.attachResourceToDataSource = function (dataSourceName, id) {
        var self = this;
        return attachResourceToDataSource(self, dataSourceName, id);
    };

    ResourceRepository.prototype.removeResourceFromDataSource = function (dataSourceName, id) {
        var self = this;
        return removeResourceFromDataSource(self, dataSourceName, id);
    };

    ResourceRepository.prototype.update = function (serverDataByDataSourceName, dataExtractor, ModelFactory, diffFunction, mergeFunction) {
        var self = this;

        var resourcesWithUpdates = {};
        var deletedResources = [];
        var changeSummaryByDataSourceName = {};

        _.forEach(serverDataByDataSourceName, function (serverData, dataSourceName) {

            var data = dataExtractor(serverData);
            var isNewDataSource = !self.resourceIdsByDataSource[dataSourceName];

            var idsInRepository = getOrCreateResourceIdByDataSourceList(self, dataSourceName);
            var idsInNewData = _.pluck(data, "id");

            var changeSet = self.diff.changeset(idsInRepository, idsInNewData);

            _.forEach(changeSet.removed, function (value) {
                if (!_.isEmpty(self.resourcesById[value])) {
                    deletedResources.push(self.resourcesById[value]);
                    self.removeResourceFromDataSource(dataSourceName, value);
                }
            });

            // Determine which resources already exist in the repository, but are not currently associated with the
            // data source. Where this is the case, they should be associated with the data source and treated as an
            // update of the existing resource, rather than an insertion.
            var existingResourcesToAssociate = _.chain(self.resourcesById)
                .keys()
                .map(Number)
                .filter(function (id) {
                    return _.contains(changeSet.added, id);
                })
                .value();

            // Associate the existing resources, remove the IDs from the list of added resources, and add them to the list
            // of updated resources.
            _.forEach(existingResourcesToAssociate, function (id) {
                self.attachResourceToDataSource(dataSourceName, id);
            });

            changeSet.other = _.union(changeSet.other, existingResourcesToAssociate);

            // Add new resources
            _.forEach(changeSet.added, function (id) {
                self.attachResourceToDataSource(dataSourceName, id);

                if (!self.resourcesById[id]) {
                    var newData = _.find(data, {
                        "id": id
                    });

                    if (newData) {
                        self.resourcesById[id] = new ModelFactory(newData);
                        self.resourcesById[id].timestamp = new Date();
                    }
                }
            });

            _.forEach(data, function (src) {
                if (!_.contains(changeSet.other, src.id)) {
                    return;
                }

                var diff = diffFunction(self.resourcesById[src.id], src);

                if (diff) {
                    resourcesWithUpdates[src.id] = diff;
                }
            });

            // Return a summary of the changes.

            // added:   All newly added resources, indexed by id.
            // updates: All changes to existing resources, indexed by id.
            // removed: All resources which were orphaned by this update and subsequently deleted, indexed by id.

            var changeSummary = {};

            if (!_.isEmpty(changeSet.added)) {
                var newData = _.chain(changeSet.added)
                    .mapKeys()
                    .mapValues(getResourceById(self))
                    .value();

                if (isNewDataSource) {
                    changeSummary.initialised = newData;
                } else {
                    changeSummary.added = newData;
                }
            } else if (isNewDataSource) {
                changeSummary.initialised = {};
            }

            if (!_.isEmpty(deletedResources)) {
                changeSummary.removed = deletedResources;
            }

            changeSummaryByDataSourceName[dataSourceName] = changeSummary;

        });

        _.forEach(resourcesWithUpdates, function (diff) {
            mergeFunction(self.resourcesById[diff.id], diff);
            self.resourcesById[diff.id].timestamp = new Date();
        });

        _.forEach(self.resourceIdsByDataSource, function (resourceIds, dataSourceName) {
            var dataSourceUpdates = {};
            var containsUpdate = false;

            _.forEach(resourcesWithUpdates, function (diff) {
                if (_.contains(resourceIds, diff.id)) {
                    dataSourceUpdates[diff.id] = diff;
                    containsUpdate = true;
                }
            });

            if (containsUpdate) {
                if (!changeSummaryByDataSourceName[dataSourceName]) {
                    changeSummaryByDataSourceName[dataSourceName] = {};
                }

                changeSummaryByDataSourceName[dataSourceName].updates = dataSourceUpdates;
            }
        });

        return changeSummaryByDataSourceName;
    };

    ///////////////////////////////////////////////////////////

    /**
     * @ngdoc service
     * @name angular-sitestack-utilities.resourceRepository
     * @requires sportsbook.markets.dif
     * @requires angular-sitestack-utilitie.queue
     * @description
     * Manager service for all resource repositories
     */
    function ResourceRepositoryManager(diff, queue) {
        this.repositories = {};
        this.diff = diff;
        this.queue = queue;
    }

    /**
     * @ngdoc method
     * @name angular-sitestack-utilities.resourceRepository#get
     * @methodOf angular-sitestack-utilities.resourceRepository
     * @description
     * Get a resource repository by name
     *
     * @param  {string} name - The name of the resource repository to get.
     * @return {ResourceRepository} - The returned ResourceRepository object.
     */
    ResourceRepositoryManager.prototype.get = function (name) {
        if (!this.repositories[name]) {
            this.repositories[name] = new ResourceRepository(this.diff);
        }
        return this.repositories[name];
    };

    /**
     * @ngdoc method
     * @name angular-sitestack-utilities.resourceRepository#update
     * @methodOf angular-sitestack-utilities.resourceRepository
     * @description
     * Safe update for each repository.
     *
     * @param  {string} name - The name of the resource repository to update.
     * @param  {object} serverDataByDataSourceName - The retrieved data dictionary by data source name.
     * @param  {function} dataExtractor -
     * @param  {constructor} ModelFactory -
     * @param  {function} diffFunction -
     * @param  {function} mergeFunction -
     * @return {Promise} - A Promise object that returns the diff changes in the form of a dictionary by data source name.
     */
    ResourceRepositoryManager.prototype.update = function (name, serverDataByDataSourceName, dataExtractor, ModelFactory, diffFunction, mergeFunction) {
        var self = this;
        return self.queue.enqueue("repository-" + name, function () {
            return self.get(name).update(serverDataByDataSourceName, dataExtractor, ModelFactory, diffFunction, mergeFunction);
        }, "update");
    };

    /**
     * @ngdoc method
     * @name angular-sitestack-utilities.resourceRepository#removeDataSourceFrom
     * @methodOf angular-sitestack-utilities.resourceRepository
     * @description
     * Safe removal of a data source from a repository.
     *
     * @param  {string} name - The name of the repository.
     * @param  {string} dataSourceName - The name of the data source to remove from the repository.
     * @return {Promise} - Returns a promise.
     */
    ResourceRepositoryManager.prototype.removeDataSourceFrom = function (name, dataSourceName) {
        var self = this;
        return self.queue.enqueue("repository-" + name, function () {
            return self.get(name).removeDataSource(dataSourceName);
        }, "removeDataSource");
    };

    angular.module("angular-sitestack-utilities").service("resourceRepository", ["diff", "queue", ResourceRepositoryManager]);

}(window.angular));
