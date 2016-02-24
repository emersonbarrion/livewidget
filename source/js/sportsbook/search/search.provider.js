(function(angular) {
    "use strict";

    var module = angular.module('sportsbook.search');

    module.provider('searchResults', function() {
        var self = this;

        self.$get = ['searchService', 'lodash', function(searchService, lodash) {
            return {
                getSearchResults: function(options) {
                    return searchService.search({
                            text: options.text
                        })
                        .then(function(data) {
                            return lodash.map(data.data, function(item) {
                                return {
                                    events: _.pluck(item.el, "ei"),
                                    participant: item.sm,
                                    categoryName: item.cn,
                                    categoryId: item.ci
                                };

                            });
                        });
                },
                getParticipantsNames: function(options) {

                    return searchService.search({
                            text: options.text
                        })
                        .then(function(data) {
                            return lodash.map(data.data, function(participant) {
                                return {
                                    participantName: participant.pn
                                };
                            });
                        });
                }
            };
        }];
    });

}(window.angular));
