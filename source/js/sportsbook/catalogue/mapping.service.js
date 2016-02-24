(function (angular) {
    "use strict";

    var module = angular.module('sportsbook.configuration');

    var CatalogueMappingServiceClass = function (resource) {
        
        this.resource = resource;
    };

    CatalogueMappingServiceClass.prototype.byId = function (id) {

        return this.resource.query().then(function (data) {
            return data[+id];
        });
    };

    module.service("catalogueMappingService", ["catalogueMappingResource", CatalogueMappingServiceClass]);
}(window.angular));
