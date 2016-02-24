(function (angular, slug) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    /*
                                 _,.-------.,_
                             ,;~'             '~;,
                           ,;                     ;,
                          ;                         ;
                         ,'                         ',
                        ,;                           ;,
                        ; ;      .           .      ; ;
                        | ;   ______       ______   ; |
                        |  `/~"     ~" . "~     "~\'  |
                        |  ~  ,-~~~^~, | ,~^~~~-,  ~  |
                         |   |        }:{        |   |
                         |   l       / | \       !   |       ____   
        _________________.~  (__,.--" .^. "--.,__)  ~.______/ O  \___/
       <_________________|     ---;' / | \ `;---     |___________/   \
                          \__.       \/^\/       .__/
                           V| \                 / |V
                            | |T~\___!___!___/~T| |
                            | |`IIII_I_I_I_IIII'| |
                            |  \,III I I I III,/  |
                             \   `~~~~~~~~~~'    /
                               \   .       .   /     
                                 \.    ^    ./
                                   ^~~~^~~~^

    Beware Harry for this code bears the dark mark.
    */
    function DiscombobulationService() {

    }

    DiscombobulationService.prototype.discombobulateName = function (victim, lineValue) {
        if (!victim) {
            return victim;
        }

        if (!lineValue) {
            return victim;
        }

        var clean = function (victim) {
            return victim.replace(".0", "").replace(/ *- *0/, "").replace(/0 *- */, "-").trim();
        };

        var cleanedLineValue = clean(lineValue);
        var cleanedVictim = clean(victim);

        if (cleanedVictim === cleanedLineValue) {
            return cleanedVictim;
        }

        return cleanedVictim.replace(cleanedLineValue, "").trim();
    };

    DiscombobulationService.prototype.discombobulateBetGroupName = function (victim) {
        if (!victim) {
            return victim;
        }

        return victim.replace("#line#", "").trim();
    };

    module.service("_discombobulationService", DiscombobulationService);
})(window.angular);


(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.markets");

    var isa2EventsAdapterClass = function (lodash, scoreboardsAdapter, catalogueMappings, $log, _discombobulationService) {
        this.scoreboards = scoreboardsAdapter;
        this.catalogueMappings = catalogueMappings;
        this._discombobulationService = _discombobulationService;
        this.$log = $log;
    };


    isa2EventsAdapterClass.$inject = ["lodash", "scoreboardsAdapter", "catalogueMappings", "$log", "_discombobulationService"];

    isa2EventsAdapterClass.prototype.toSelection = function (parent, data) {
        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return this.toSelection(parent, element);
            }, this);
        }

        var selection = {
            "marketId": parent.id,
            "eventId": parent.eventId,
            "marketName": parent.name,
            "eventName": parent.eventName,
            "isLive": parent.isLive,
            "ruleId": parent.ruleId,
            "participantId": data.pi,
            "subCategoryId": parent.subCategoryId,
            "categoryId": parent.categoryId,
            "regionId": parent.regionId,
            "betGroupId": parent.betGroup.id,
            "id": data.msi,
            "name": this._discombobulationService.discombobulateName(data.mst, parent.lineValue),
            "odds": data.msp,
            "sortOrder": data.so,
            "isDisabled": data.msp === 1.0,
            "isOnHold": parent.isOnHold
        };

        return selection;
    };

    isa2EventsAdapterClass.prototype.toStreamDefinition = function (parent, data) {
        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return this.toStreamDefinition(parent, element);
            }, this);
        }

        return {
            "event": {
                "id": parent.id
            },
            "type": data.st, //  (1 - EventVideo, 2 - EventVisual, 3 - EventStats)
            "provider": data.sp, //  (1 - Perform, 2 - SportsMan, 3 - Score24)
            "id": data.si,
            "url": data.su,
            "availability": data.sa, // (0 - All, 1 - PreMatch Only, 2 - Live Only)
            "requireAuthentication": data.ra === 1
        };
    };

    isa2EventsAdapterClass.prototype.toParticipant = function (parent, data) {
        var self = this;
        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return self.toParticipant(parent, element);
            }, self);
        }

        // retrieve the statistics external id
        var externalId = _.find(data.sl, function (item) {
            return item.st === 3 && item.sp === 3; // statistics && score 24
        });

        var participant = {
            "event": {
                "id": parent.id
            },
            "id": data.pi,
            "sortOrder": data.so,
            "externalId": externalId ? externalId.si : null
        };

        if (data.sl) {
            participant.streams = self.toStreamDefinition(parent, data.sl);
        }

        return participant;
    };

    isa2EventsAdapterClass.prototype.toMarket = function (parent, data) {
        if (_.isArray(data)) {
            return _.map(data, function (element) {
                return this.toMarket(parent, element);
            }, this);
        }

        var market = {
            "eventId": parent.id,
            "id": data.mi,
            "name": this._discombobulationService.discombobulateName(data.mn, data.lv),
            "eventName": parent.name,
            "deadline": new Date(data.dd),
            "categoryId": parent.category.id,
            "regionId": parent.region.id,
            "subCategoryId": parent.subCategory.id,
            "isLive": parent.isLive,
            "isHeadToHead": data.bgtci === 8,
            "text": data.ht,
            "ruleId": data.cri,
            "betGroup": {
                "id": data.bgi,
                "name": this._discombobulationService.discombobulateBetGroupName(data.bgn),
                "text": data.bgd,
                "group": {
                    "id": data.bggi,
                    "name": data.bggn
                }
            },
            "status": data.ms, // 10 - Open, 20 - On Hold
            "isOnHold": (data.ms === 20)
        };

        if (data.lv && data.lv !== "0 - 0.0") {
            market.lineValue = data.lv;
        }

        market.selections = this.toSelection(market, data.msl);

        return market;
    };

    isa2EventsAdapterClass.prototype.toEvent = function (parent, data) {

        var self = this;
        var liveStream = false;

        if (_.isArray(data)) {
            return _.chain(data).map(function (element) {
                return self.toEvent(parent, element);
            }).compact().value();
        }

        if (!data.ci || _.isUndefined(self.catalogueMappings.byId(data.ci))) {
            self.$log.warn("Events adapter warning: Rejecting event id " + data.ei + " as it belongs to catgeory id " + data.ci + ", which is not defined in catalogueMappings", data);
            return null;
        }

        // check if for this event we have streams - video
        if (data.sl && data.sl.length > 0) {
            liveStream = _.some(data.sl, {
                "st": 1,
                "sa": 1
            });
        }

        var event = {
            "id": data.ei,
            "name": data.en,
            "shortName": slug(data.en),
            "startDateTime": new Date(data.sd),
            "liveEvent": data.il,
            "eventPhase": data.cep,
            "liveStream": liveStream,
            "isLive": (data.cep === 2),
            "category": {
                "id": data.ci,
                "isStub": true
            },
            "region": {
                "id": data.ri,
                "isStub": true
            },
            "subCategory": {
                "id": data.sci,
                "isStub": true
            },
            "sortRank": {
                "popularityRank": data.sr.pbbpoe
            },
            "marketCount": data.mc
        };

        // retrieve the statistics external id
        var externalId = _.find(data.sl, function (item) {
            return item.st === 3 && item.sp === 3; // statistics && score 24
        });

        event.externalId = externalId ? externalId.si : null;

        event.markets = this.toMarket(event, data.ml);

        if (data.epl) {
            event.participants = this.toParticipant(event, data.epl);
        } else {
            event.participants = null;
        }

        if (data.sl) {
            event.streams = this.toStreamDefinition(event, data.sl);
        } else {
            event.streams = null;
        }

        if (event.isLive && data.sb) {
            event.scoreboard = this.scoreboards.toScoreboard(data.sb, event);
        } else {
            event.scoreboard = null;
        }

        return event;
    };

    module.service("eventsAdapter", isa2EventsAdapterClass);
}(window.angular, window.slug));
