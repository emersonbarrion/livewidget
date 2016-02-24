(function(angular) {
    "use strict";

    var QueueManagerClass = function($q, $log) {
        this.$q = $q;
        this.$log = $log;
        this.queues = {};
    };

    QueueManagerClass.prototype.get = function(queueName)
    {
        if (!this.queues[queueName]) {
            this.queues[queueName] = new Queue(this.$q, this.$log);
        }

        return this.queues[queueName];
    };

    QueueManagerClass.prototype.enqueue = function(queueName, task, taskName) {


        return this.get(queueName).enqueue(task, taskName);
    };

    QueueManagerClass.prototype.isLoading = function(queueName) {

        return (queueName) ? this.get(queueName).isLoading() : _.any(_.values(this.queues), function (q) {
            return q.isLoading();
        });
    };

    var Queue = function($q, $log) {
        this.$q = $q;
        this.$log = $log;
        this.previousTask = $q.when();
        this.tasks = {};
    };

    Queue.prototype.enqueue = function (task, taskName) {

        var self = this;
        var taskKey = taskName + "_" + (new Date().getTime());

        var currentTask = self.previousTask.then(function () {
            return self.$q.when(task());
        }).catch(function (ex) {
            self.$log.error("Error caused by queue function: ", ex, " continuing queue.");
        }).finally(function () {
            delete self.tasks[taskKey];
        });

        self.tasks[taskKey] = true;

        self.previousTask = currentTask;

        return currentTask;
    };

    Queue.prototype.isLoading = function() {
        return _.keys(this.tasks).length !== 0;
    };

    angular.module("angular-sitestack-utilities").service("queue", ["$q", "$log", QueueManagerClass]);
}(window.angular));
