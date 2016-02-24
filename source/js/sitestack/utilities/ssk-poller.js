(function (angular) {

    angular
    .module("angular-sitestack-utilities")
    .factory("pollerFactory", ["$log", "$q", "queue", function ($log, $q, queue) {

        var PollingTask = function (key, taskFn, intervalMillis) {
            this.key = key;
            this.taskFn = taskFn;
            this.intervalMillis = intervalMillis;
            this._interval = null;
        };

        PollingTask.prototype.start = function () {
            var self = this;
            var taskKey = ["start", self.key].join("_");
            return queue.enqueue("poller", function () {
                if (!self._interval && self.intervalMillis > 0) {
                    self._interval = setInterval(function () {
                        $log.debug("Poller: running task '" + self.key + "'");
                        self.taskFn();
                    }, self.intervalMillis);
                    return true;
                }
                return false;
            }, taskKey);
        };

        PollingTask.prototype.stop = function () {
            var self = this;
            var taskKey = ["stop", self.key].join("_");
            return queue.enqueue("poller", function () {
                if (self._interval) {
                    clearInterval(self._interval);
                    self._interval = null;
                    return true;
                }
                return false;
            }, taskKey);
        };

        PollingTask.prototype.isStarted = function () {
            return Boolean(this._interval);
        };

        /////////////////////////////////////////////////

        var STATES = {
            STARTED: 1,
            STOPPED: 2
        };

        var PollerFactoryClass = function () {
            this.tasks = [];
            this.state = STATES.STOPPED;
            this.defaultIntervalMillis = PollerFactoryClass.DEFAULT_INTERVAL_MILLIS;
        };

        PollerFactoryClass.DEFAULT_INTERVAL_MILLIS = 10000; // 10 seconds

        PollerFactoryClass.prototype.addPollingTask = function (key, taskFn, intervalMillis) {
            if (!key || !taskFn) {
                throw new Error("Poller:addPollingTask - You must provide both a 'key' and a 'taskFn' to create a polling task.");
            }

            if (!intervalMillis) {
                intervalMillis = this.defaultIntervalMillis;
            }

            intervalMillis = Number(intervalMillis);
            if (_.isNaN(intervalMillis) || intervalMillis < 1) {
                throw new Error("Poller:addPollingTask - Invalid value for intervalMillis (" + intervalMillis + ")");
            }

            var task = new PollingTask(key, taskFn, intervalMillis);
            this.tasks.push(task);

            if (this.state === STATES.STARTED) {
                return task.start();
            }

            return $q.when(true);
        };

        PollerFactoryClass.prototype.removePollingTask = function (key) {
            var self = this;
            if (!key) {
                throw new Error("Poller:removePollingTask - You must provide a 'key' to remove an existing polling task.");
            }

            var task = _.find(self.tasks, { "key": key });
            if (!task) {
                throw new Error("Poller:removePollingTask - Task with key: ''" + key + "' was not found.");
            }

            return task.stop().then(function (result) {
                _.remove(self.tasks, { "key": key });
                return result;
            });
        };

        PollerFactoryClass.prototype.setDefaultInterval = function (defaultIntervalMillis) {
            this.defaultIntervalMillis = defaultIntervalMillis;
        };

        PollerFactoryClass.prototype.setTaskInterval = function (key, intervalMillis) {
            if (!key) {
                throw new Error("Poller:setTaskInterval - You must provide a 'key' to set the interval milliseconds for an existing task.");
            }

            intervalMillis = Number(intervalMillis);
            if (_.isNaN(intervalMillis) || intervalMillis < 0) {
                throw new Error("Poller:setTaskInterval - Invalid value for intervalMillis (" + intervalMillis + ")");
            }

            var task = _.find(this.tasks, { "key": key });
            if (!task) {
                throw new Error("Poller:setTaskInterval - Task with key: ''" + key + "' was not found.");
            }

            task.intervalMillis = intervalMillis;

            if (this.state === STATES.STARTED) {
                task.stop().then(function (result) {
                    task.start();
                });
            }
        };

        PollerFactoryClass.prototype.start = function () {
            this.state = STATES.STARTED;
            return $q.all(_.map(this.tasks, function (t) {
                return t.start();
            }));
        };

        PollerFactoryClass.prototype.stop = function () {
            this.state = STATES.STOPPED;
            return $q.all(_.map(this.tasks, function (t) {
                return t.stop();
            }));
        };

        PollerFactoryClass.prototype.isStarted = function () {
            return this.state === STATES.STARTED;
        };

        PollerFactoryClass.prototype.isStopped = function () {
            return this.state === STATES.STOPPED;
        };

        PollerFactoryClass.prototype.clearTasks = function () {
            var self = this;
            return self.stop().then(function () {
                self.tasks.length = 0;
                return true;
            });
        };

        return PollerFactoryClass;

    }]);

}(window.angular));
