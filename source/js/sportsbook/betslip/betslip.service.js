(function (angular) {
    "use strict";

    var module = angular.module("sportsbook.betslip");

    var DATASOURCE_NAME = "betslip";

    var BetslipServiceClass = function ($rootScope, $q, sportsbookUserSettings, validator, couponPlacementErrorFormatter, sportsbookConfiguration, eventDataSourceManager, eventDataSourceManagerConfiguration, bonusService, applicationState, couponTypes, couponViewModel, bets) {
        var self = this;

        // dependencies
        self.$rootScope = $rootScope;
        self.$q = $q;
        self.bonusService = bonusService;
        self.applicationState = applicationState;
        self.userSettings = sportsbookUserSettings;
        self.bets = bets;
        self.eventDataSourceManager = eventDataSourceManager;
        self.eventDataSourceManagerConfiguration = eventDataSourceManagerConfiguration;
        self.couponTypes = couponTypes;
        self.couponType = couponTypes.single;
        self.couponViewModels = couponViewModel;
        self.couponPlacementErrorFormatter = couponPlacementErrorFormatter;
        self.config = sportsbookConfiguration;
        self.validator = validator;

        // properties
        self.initialised = false;
        self.viewModel = null;
        self.validationStatus = [];
        self.isValid = {
            "valid": null
        };
        self.bonuses = {};

        self.restrictions = [
            self.config.maximumSingleSelections,
            self.config.maximumCombinationSelections,
            self.config.maximumSystemBetSelections
        ];

        // React to changes on the user object (login/logout)
        self.applicationState.user.subscribe(function (user) {
            if (self.initialised) {
                if (user.isAuthenticated && user.details) {
                    self.viewModel.taxRate = user.details.taxRate;
                } else {
                    self.viewModel.taxRate = 0;
                }

                // SSK-1297 validate the betslip
                self.$validate();
            }
            return self._checkForBonuses();
        }, true);
    };

    var requireInitialisation = function (func) {
        return function () {
            if (!this.initialised) {
                throw new Error("Attempted to use uninitialised betslip");
            }
            return func.apply(this, arguments);
        };
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#$initializeCoupon
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Initializes the service coupon based on data stored under the persistence key (default: "coupon"). If no stored data is found, an empty single coupon will be returned instead.
     *
     * @returns {Sportsbook.Coupon} The coupon for the service.
     */
    BetslipServiceClass.prototype.initialise = function () {
        var self = this;

        if (self.initialised) {
            return self.eventDataSourceManager.reload(DATASOURCE_NAME).then(function () {
                self.viewModel.update();
                return true;
            });
        }

        var storedCoupon = self.userSettings.coupon;

        self.couponType = self.couponTypes.single;
        var initialData = {};

        if (storedCoupon) {
            initialData = storedCoupon.data;
            self.couponType = storedCoupon.type;
        }

        return self.eventDataSourceManager.createVariableSelectionListDataSource(DATASOURCE_NAME, initialData, ["live"]).then(function (dataSource) {
            self.selectionsByMarketId = dataSource;
            self.viewModel = new self.couponViewModels.byType(self.couponType).create(self.selectionsByMarketId.content);

            self.$validate();
            self.initialised = true;

            return self._setTaxRateFromUser();
        }).then(function () {
            return self._checkForBonuses();
        }).then(function () {
            return true;
        });
    };

    BetslipServiceClass.prototype._setTaxRateFromUser = requireInitialisation(function () {
        var self = this;
        return self.applicationState.user().then(function (user) {
            if (user && user.isAuthenticated) {
                self.viewModel.taxRate = user.details.taxRate;
            } else {
                self.viewModel.taxRate = 0;
            }
        });
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#convertTo
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Converts a coupon to the given type.
     *
     * @param {int} type - The type identifier for the requested coupon type.
     * @returns {Object} - The newly converted coupon view model.
     */
    BetslipServiceClass.prototype.convertTo = requireInitialisation(function (type) {

        var fromType = this.couponType;
        var taxRate = this.viewModel.taxRate;

        // Change coupon type.
        this.couponType = type;
        this.viewModel = this.couponViewModels.byType(type).create(this.selectionsByMarketId.content);
        this.viewModel.taxRate = taxRate;

        // SSK-876 - restrict the maximum number of selections for system bets.
        // SSK-915 - restrict maximum number of selections for combi bets.
        this._checkForSelectionLimits();

        this.$afterChange({
            command: "convertTo",
            from: fromType,
            to: type
        });

        return this.viewModel;
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#reset
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Empties the coupon. The type of the coupon remains the same.
     *
     * @returns {Object} - The newly cleared view model.
     */
    BetslipServiceClass.prototype.reset = function () {
        // OSB-460 - save the tax rate to be able to set it again on the view model after reset - AD
        var taxRate = this.viewModel.taxRate;

        this.selectionsByMarketId.clear();
        this.viewModel = this.couponViewModels.byType(this.couponType).create(this.selectionsByMarketId.content);
        this.viewModel.taxRate = taxRate;

        // Validate and save changes.
        this.$afterChange({
            command: "reset"
        });

        return this.viewModel;
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslipService#getSelectedBonus
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Returns the bonus which has been selected from the list of available bonuses on the betslip.
     *
     * @returns {Object} - The selected bonus in the list of available bonuses.
     */
    BetslipServiceClass.prototype.getSelectedBonus = requireInitialisation(function () {
        return _.find(this.bonuses, function (b) {
            return b.isSelected;
        });
    });

    BetslipServiceClass.prototype._checkForSelectionLimits = requireInitialisation(function (selection) {
        if (this.viewModel.isLimitReached) {
            this.$rootScope.$broadcast("ssk.max.selections.in.betslip", {
                "selection": selection,
                "count": this.viewModel.numberOfSelections,
                "max": this.viewModel.maximumNumberOfSelections
            });
            return true;
        }
        return false;
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#add
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Adds a selection to the coupon.
     *
     * @param {selection} selection - The selection to add.
     * @returns {Object} - A command in the form { "command": "added", "selection":Object }, where the value of selection will be the same as the selection passed in.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.add = requireInitialisation(function (selection) {
        var self = this;

        var nullCommand = {
            command: "no-op",
            selection: selection
        };

        if (self.isSubmittingCoupon()) {
            return nullCommand;
        }

        // SSK-1045 - selections with odds of 1.00 should not be added to the betslip.
        if (selection.odds === 1.00) {
            return nullCommand;
        }

        if (selection.isOnHold) {
            return nullCommand;
        }

        // SSK-876 - restrict the maximum number of selections for system bets.
        // SSK-915 - restrict maximum number of selections for combi bets.
        if (self._checkForSelectionLimits(selection)) {
            return nullCommand;
        }

        if (self.isMarketInCoupon(selection)) {

            var selectionFromSameMarket = self.selectionsByMarketId.content[selection.marketId];

            if (selectionFromSameMarket.id === selection.id) {
                return nullCommand;
            }

            self.remove(selectionFromSameMarket);
        }

        self.selectionsByMarketId.addSelection(selection);
        var eventArguments = {
            command: "added",
            selection: selection
        };

        self.$afterChange(eventArguments);
        return eventArguments;
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#remove
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Removes a selection from the underlying coupon. Since only one selection can be made from each market, the selection will be identified by market id.
     *
     * @param {selection} selection - The selection to remove.
     * @returns {Object} - A command object in the form { "command": "removed", "selection":Object }, where the value of selection will be the same as the selection passed in. If the selection is NOT removed (for example, it was not there to begin with) { "command": "no-op", "selection":Object } will be returned instead.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.remove = requireInitialisation(function (selection) {

        var self = this;

        var nullCommand = {
            command: "no-op",
            selection: selection
        };

        if (self.isSubmittingCoupon()) {
            return nullCommand;
        }

        var isRemoved = self.selectionsByMarketId.removeSelection(selection);

        if (isRemoved) {
            var eventArguments = {
                command: "removed",
                selection: selection
            };
            self.$afterChange(eventArguments);
            return eventArguments;
        } else {
            return nullCommand;
        }
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#toggle
     * @methodOf sportsbook.betslip.betslipService
     * @description Adds or removes a selection from the coupon, depending on whether it is currently in the coupon or not.
     *
     * @param {selection} selection - The selection to add or remove.
     * @returns {Promise} - The promise returned by Add or Remove.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.toggle = function (selection) {
        return this[this.isInCoupon(selection) ? "remove" : "add"](selection);
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#isEligible
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Determines whether a selection can be added to the coupon. A selection is eligible if it is compatible with all the rules of the items already in the betslip.
     *
     * @param {selection} selection - The selection to check.
     * @returns {Boolean} True if the selection can be added to the coupon, otherwise false.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.isEligible = requireInitialisation(function (selection) {
        var self = this;

        if (!selection) {
            return false;
        }

        if (!selection.odds || selection.odds === 1.00) {
            return false;
        }

        return this.isMarketInCoupon(selection) || !_.any(this.validator.testSelection(selection, this), {
                passed: false
            });
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#isMarketInCoupon
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Determines whether a selection's market is in the coupon.
     *
     * @param {selection} selection - The selection to check.
     * @returns {boolean} true if the selection market is in the coupon.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.isMarketInCoupon = requireInitialisation(function (selection) {
        if (!selection) {
            return false;
        }

        return !_.isUndefined(this.selectionsByMarketId.content[selection.marketId]);
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#isInCoupon
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Determines whether the specified selection has already been placed in the coupon.
     *
     * @param {selection} selection - The selection to query for.
     * @returns {boolean} true if the selection is in the coupon, otherwise false.
     */
    BetslipServiceClass.prototype.isInCoupon = requireInitialisation(function (selection) {
        var self = this;

        if (!selection) {
            return false;
        }

        if (_.isArray(selection)) {
            return _.some(selection, function (x) {
                return self.isInCoupon(x);
            });
        }

        if (!this.isMarketInCoupon(selection)) {
            return false;
        }

        return self.selectionsByMarketId.content[selection.marketId].id === selection.id;
    });

    BetslipServiceClass.prototype._checkForBonuses = function () {
        var self = this;

        return self.$q.when().then(function () {
            if (!self.initialised) {
                return null;
            }

            // The System coupon has no bonuses
            if (self.couponType === 2) {
                return null;
            }

            // The single coupon has a bonus only for one selection
            if (self.couponType === 0 && _.keys(self.selectionsByMarketId.content).length > 1) {
                return null;
            }

            return self.bonusService.checkBonus(self.selectionsByMarketId.content).then(function (bonuses) {
                if (!_.isEmpty(bonuses)) {
                    return bonuses;
                } else {
                    return null;
                }
            });
        }).then(function (bonuses) {

            _.each(bonuses, function (bonus) {
                var bonusKey = bonus.customerBonusId;

                if (!self.bonuses[bonusKey]) {
                    self.bonuses[bonusKey] = {
                        isSelected: false,
                        originalBonus: bonus
                    };
                } else {
                    self.bonuses[bonusKey].originalBonus = bonus;
                }

            });

            _.removeFromDict(self.bonuses, function (bonus) {
                return !_.any(bonuses, {
                    customerBonusId: bonus.originalBonus.customerBonusId
                });
            });
        });
    };

    BetslipServiceClass.prototype._clearBonuses = function () {
        var self = this;

        // Reset the other bonuses
        _.each(self.bonuses, function (bonus) {
            bonus.isSelected = false;
        });

        // OSB-462 - Put the tax rate on the Betslip (if applicable) once the bonus is cleared.
        self._setTaxRateFromUser();
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#selectBonus
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Selects the bonus and stores it in the bonus service and updates the stake
     */
    BetslipServiceClass.prototype.selectBonus = function (selectedBonus) {
        var self = this;

        var weHaveANewBonus = !!selectedBonus;

        // Reset the other bonuses
        _.each(self.bonuses, function (bonus) {
            if (bonus !== selectedBonus) {
                bonus.isSelected = false;
            }
        });

        if (weHaveANewBonus) {
            self.viewModel.setStakeUsedForBonus(selectedBonus.originalBonus.stake);
            self.viewModel.taxRate = 0; // OSB-462 - FBs and RFBs should not be shown as taxed on the Betslip - AD
        } else if (!weHaveANewBonus) {
            self.viewModel.setStakeUsedForBonus(0);
            self._setTaxRateFromUser(); // OSB-462 - Put the tax rate on the Betslip (if applicable) once the bonus is cleared.
        }
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#toggleBonus
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Toggle's a bonus being selected/deselected on the betslip.
     *
     * @param  {object} bonus - The bonus to toggle.
     */
    BetslipServiceClass.prototype.toggleBonus = function (bonus) {
        if (bonus.isSelected) {
            this.selectBonus(bonus);
        } else {
            this.selectBonus(false);
        }
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#$validate
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Validates the selections in the coupon.
     *
     * @returns {Array} The validation results.
     */
    BetslipServiceClass.prototype.$validate = function () {
        var potentialWinLessThanTotalStake = (this.viewModel.totalPotentialWin <= this.viewModel.totalStake);

        this.validationStatus.length = 0;
        this.validationStatus.push.apply(this.validationStatus, this.validator.validate(this));

        this.isValid.valid = (_.where(this.validationStatus, {
            passed: false
        }).length === 0);

        if (potentialWinLessThanTotalStake) {
            this.isValid.valid = false;
            return;
        }

    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#$persist
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Stores the coupon under the persistence key.
     */
    BetslipServiceClass.prototype.$persist = function () {
        this.userSettings.coupon = {
            data: this.selectionsByMarketId,
            type: this.couponType
        };
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#$afterChange
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Runs the validations and persists the coupon after a change.
     *
     * @param {object} command - The command object to broadcast with the 'betslip-changed' event.
     */
    BetslipServiceClass.prototype.$afterChange = function (command) {
        var self = this;
        self.viewModel.updateSelections(this.selectionsByMarketId.content);

        self.$validate();

        self.$persist();
        self.$rootScope.$broadcast("betslip-changed", command);

        self._checkForBonuses();
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#submitCoupon
     * @methodOf sportsbook.betslip.betslipService
     * @description Determines if a submit coupon operation is currently in progress.
     * @param {Object} options - The request options.
     * @returns {Promise} A promise which will be resolved with the result of the placement request.
     * @throws {Error} - If the betslip is not yet initialised.
     */
    BetslipServiceClass.prototype.submitCoupon = requireInitialisation(function (options) {
        var self = this;
        var couponRequest = self.viewModel.request();
        var selectedBonus = self.getSelectedBonus();

        if (!options) {
            options = {};
        }

        couponRequest.bonusCustomerId = selectedBonus ? selectedBonus.originalBonus.customerBonusId : null;

        return self.bets.submitCoupon(_.merge({
            coupon: couponRequest,
            isForManualAttest: self.viewModel.isForManualAttest
        }, options)).then(function (response) {
            // Success
            self.$rootScope.$broadcast("betslip-submit-coupon-success", response);
            return response;
        }, function (errors) {
            // Failed
            self.$rootScope.$broadcast("betslip-submit-coupon-failed", errors);
            var transformedErrors = self.couponPlacementErrorFormatter.format(self._transformErrors(errors));
            return self.$q.reject(transformedErrors);
        });
    });

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#isSubmittingCoupon
     * @methodOf sportsbook.betslip.betslipService
     * @description Determines if a submit coupon operation is currently in progress.
     * @returns {Boolean} True if the coupon is being submitted, otherwise false.
     */
    BetslipServiceClass.prototype.isSubmittingCoupon = function () {
        return this.bets.isSubmittingCoupon();
    };

    BetslipServiceClass.prototype._transformErrors = function (errors) {
        var self = this;

        _.forEach(errors, function (error) {
            var selectionParameters = self._getErrorSelectionParameters(error);
            error.selectionParameters = (_.isEmpty(selectionParameters)) ? null : selectionParameters;
        });

        return errors;
    };

    BetslipServiceClass.prototype._getErrorSelectionParameters = function (error) {
        var self = this;
        var results = [];

        if (_.isArray(error.errorParams)) {
            _.forEach(error.errorParams, function (errorParameter) {
                var filter;

                if (errorParameter.marketSelectionId) {
                    filter = function (selection) {
                        return selection.id === errorParameter.marketSelectionId;
                    };
                } else if (errorParameter.marketId) {
                    filter = function (selection, marketId) {
                        return marketId === errorParameter.marketId;
                    };
                } else if (errorParameter.eventId) {
                    filter = function (selection) {
                        var market = selection.getParent();
                        return market && market.eventId === errorParameter.eventId;
                    };
                } else {
                    return;
                }

                _.chain(self.selectionsByMarketId.content)
                    .filter(filter)
                    .forEach(function (selection) {
                        results.push({
                            selection: selection,
                            parameters: errorParameter
                        });
                    });
            });
        }

        return results;
    };

    /**
     * @ngdoc method
     * @name sportsbook.betslip.betslipService#bindScopeWatches
     * @methodOf sportsbook.betslip.betslipService
     * @description
     * Bind all watches to the $scope variable inside the betslip controller.
     *
     * @param {$scope} scopeObj - The $scope object to bind the watches to.
     */
    BetslipServiceClass.prototype.bindScopeWatches = function (scopeObj) {
        var self = this;

        // Listen for stake changes to clear the bonus.
        scopeObj.$watch(
            function () {
                return self.viewModel.getStakeUsedForBonus();
            },
            function (newStakeUsedForBonus, oldStakeUsedForBonus) {
                var selectedBonus = self.getSelectedBonus();

                if (!selectedBonus) {
                    return;
                }

                if (newStakeUsedForBonus === selectedBonus.originalBonus.stake) {
                    return;
                }

                self._clearBonuses();
            },
            true
        );

        // Listen for changes to the coupon stake and odd values to update the viewmodel values.
        scopeObj.$watch(
            function () {

                return {
                    // watch for changes on the coupon stake (for system and combi)
                    stake: self.viewModel.stake,

                    // watch for changes on the bets array
                    bets: self.viewModel.bets,

                    // watch for changes in the selections
                    selections: self.selectionsByMarketId.content

                };

            },
            function (newValues, oldValues) {
                self.viewModel.update();
                self.$afterChange({
                    "command": "viewModelUpdated"
                });
            },
            true // deep observe
        );

        scopeObj.$on(self.eventDataSourceManagerConfiguration.getMarketsDeletedBroadcast(DATASOURCE_NAME), function (broadcast, deletedMarkets) {
            if (!self.isSubmittingCoupon()) {
                self.$afterChange({
                    command: "expiredMarketsRemoved",
                    expiredMarkets: deletedMarkets
                });
            }
        });

        scopeObj.$on(self.eventDataSourceManagerConfiguration.getMarketsUpdatedBroadcast(DATASOURCE_NAME), function (broadcast, diffs) {
            if (!self.isSubmittingCoupon()) {
                self.$afterChange({
                    command: "marketsUpdated",
                    marketDiffs: diffs
                });
            }
        });

        scopeObj.$on(self.eventDataSourceManagerConfiguration.getEventsUpdatedBroadcast(DATASOURCE_NAME), function (broadcast, diffs) {
            if (!self.isSubmittingCoupon()) {
                self.$afterChange({
                    command: "eventsUpdated",
                    eventDiffs: diffs
                });
            }
        });

        scopeObj.$on(self.eventDataSourceManagerConfiguration.getEventsDeletedBroadcast(DATASOURCE_NAME), function (broadcast, deletedEvents) {
            if (!self.isSubmittingCoupon()) {
                self.$afterChange({
                    command: "expiredEventsRemoved",
                    expiredEvents: deletedEvents
                });
            }
        });
    };

    /**
     * @ngdoc service
     * @name sportsbook.betslip.betslipService
     * @description betslip factory
     */
    module.service("betslip", ["$rootScope", "$q", "sportsbookUserSettings", "couponValidation", "couponPlacementErrorFormatter", "sportsbookConfiguration", "eventDataSourceManager", "eventDataSourceManagerConfiguration", "bonusService", "applicationState", "couponTypes", "couponViewModel", "bets", BetslipServiceClass]);

}(angular));