(function (angular) {
    "use strict";

    function LiveCatalogueService(catalogueResource, applicationState, $q, Poller) {
        this.isActive = false;

        this.resource = catalogueResource;
        this.applicationState = applicationState;
        this.$q = $q;

        this.liveEventIdsSet = [];

        this.TASK_NAME = "ssk.poller.reload.livecatalogue";

        this._poller = new Poller();
    }

    LiveCatalogueService.$inject = ["catalogueResource", "applicationState", "$q", "pollerFactory"];

    var deriveEventTree = function (node) {
        return (_.isUndefined(node.children)) ? node.id : _.map(node.children, deriveEventTree);
    };

    var getEventIdsSet = function (catalogue) {
        return _.chain(catalogue)
            .map(deriveEventTree)
            .flattenDeep()
            .reduce(function (set, eventId) {
                set[eventId] = true;
                return set;
            }, {})
            .value();
    };

    LiveCatalogueService.prototype.reload = function () {
        var self = this;

        if (!this.isActive) {
            return this.$q.when();
        }

        return self.applicationState.culture().then(function (culture) {
            return self.resource.query(culture, 2, {
                ignoreLoadingBar: true
            }).then(function (liveCatalogue) {
                self.liveEventIdsSet = getEventIdsSet(liveCatalogue);
                return true;
            });
        });
    };

    LiveCatalogueService.prototype.init = function (intervals) {
        var self = this;

        self._intervals = {
            liveInterval: intervals.liveInterval,
            defaultInterval: intervals.defaultInterval
        };

        self._poller.addPollingTask(self.TASK_NAME, function () {
            self.reload();
        });

        self.setDefaultInterval();
        self.startPoller();
    };

    LiveCatalogueService.prototype.setLiveInterval = function () {
        this._poller.setTaskInterval(this.TASK_NAME, this._intervals.liveInterval);
    };

    LiveCatalogueService.prototype.setDefaultInterval = function () {
        this._poller.setTaskInterval(this.TASK_NAME, this._intervals.defaultInterval);
    };

    LiveCatalogueService.prototype.startPoller = function () {
        this._poller.start();
    };

    LiveCatalogueService.prototype.stopPoller = function () {
        this._poller.stop();
    };

    angular
        .module("sportsbook.catalogue")
        .service("liveCatalogueService", LiveCatalogueService);

})(window.angular);