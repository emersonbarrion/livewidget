describe("Utility: Poller", function () {

    var Poller, $log, $rootScope, testTask;

    beforeEach(module("angular-sitestack-utilities"));
    beforeEach(inject(function ($injector) {
        Poller = $injector.get("pollerFactory");
        $log = $injector.get("$log");
        $rootScope = $injector.get("$rootScope");

        testTask = jasmine.createSpy();
    }));

    it("should initialise an empty poller which is initially stopped", function () {

        var poller = new Poller();

        expect(poller.tasks).toEqual(jasmine.any(Array));
        expect(poller.tasks.length).toBe(0);
        expect(poller.isStopped()).toBe(true);

    });

    describe("addPollingTask", function () {

        it("should add a new polling task to the list of tasks", function (done) {
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", testTask, 60000).then(function () {
                expect(poller.tasks.length).toBe(1);
                expect(poller.tasks[0].key).toBe("poller.test.1");
                expect(poller.tasks[0].taskFn).toBe(testTask);
                expect(poller.tasks[0].intervalMillis).toBe(60000);
                expect(poller.tasks[0]._interval).toBe(null);
                done();
            });
            $rootScope.$apply();
        });

        it ("should start an added polling task if the poller is started", function (done) {
            var poller = new Poller();
            poller.start().then(function () {
                poller.addPollingTask("poller.test.1", testTask, 50).then(function () {
                    setTimeout(function () {
                        expect(testTask).toHaveBeenCalled();
                        done();
                    }, 100);
                });
            });
            $rootScope.$apply();
        });

        it("should throw an error for invalid inputs", function () {
            var poller = new Poller();
            expect(function () {
                poller.addPollingTask("", testTask, 60000);
            }).toThrow();
            expect(function () {
                poller.addPollingTask("poller.test.1", null, 60000);
            }).toThrow();
        });

    });

    describe("removePollingTask", function () {

        it("should remove a polling task by key", function (done) {
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", testTask, 60000).then(function () {
                poller.removePollingTask("poller.test.1").then(function () {
                    expect(poller.tasks.length).toBe(0);
                    done();
                });
            });
            $rootScope.$apply();
        });

        it("should throw an error if no key was passed in", function (done) {
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", testTask, 60000).then(function () {
                expect(function () {
                    poller.removePollingTask();
                }).toThrow();
                done();
            });
            $rootScope.$apply();
        });

    });

    describe("setTaskInterval", function () {

        it("should update the interval milliseconds for a task", function (done) {
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", testTask, 60000);
            poller.setTaskInterval("poller.test.1", 5000);
            expect(poller.tasks[0].intervalMillis).toBe(5000);
            poller.start().then(function () {
                poller.setTaskInterval("poller.test.1", 10000);
                expect(poller.tasks[0].intervalMillis).toBe(10000);
                done();
            });
            $rootScope.$apply();
        });

        it("should throw an error for invalid inputs", function () {
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", testTask, 60000);
            expect(function () {
                poller.setTaskInterval("", 5000);
            }).toThrow();
            expect(function () {
                poller.setTaskInterval("poller.test.1", -100);
            }).toThrow();
            expect(function () {
                poller.setTaskInterval("poller.test.1", "fakevalue");
            }).toThrow();
        });

    });

    describe("starting/stopping", function () {

        it("should start all task intervals if started", function (done) {
            var task1 = jasmine.createSpy();
            var task2 = jasmine.createSpy();
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", task1, 50);
            poller.addPollingTask("poller.test.2", task2, 100);
            poller.start().then(function (result) {
                expect(poller.isStarted()).toBe(true);
                expect(poller.isStopped()).toBe(false);

                setTimeout(function () {
                    expect(task1).toHaveBeenCalled();
                }, 50);

                setTimeout(function () {
                    expect(task2).toHaveBeenCalled();
                    done();
                }, 100);
            });
            $rootScope.$apply();
        });

        it("should stop all task intervals if stopped", function (done) {
            var task1 = jasmine.createSpy();
            var task2 = jasmine.createSpy();
            var poller = new Poller();
            poller.addPollingTask("poller.test.1", task1, 50);
            poller.addPollingTask("poller.test.2", task2, 100);
            poller.start().then(function () {
                expect(poller.isStarted()).toBe(true);
                expect(poller.isStopped()).toBe(false);
                poller.stop().then(function () {
                    expect(poller.isStarted()).toBe(false);
                    expect(poller.isStopped()).toBe(true);

                    setTimeout(function () {
                        expect(task1).not.toHaveBeenCalled();
                    }, 60);

                    setTimeout(function () {
                        expect(task2).not.toHaveBeenCalled();
                        done();
                    }, 110);
                });
            });
            $rootScope.$apply();
        });

    });

    describe("clear", function () {

        it("should clear and stop all tasks when called", function () {
            var task1 = jasmine.createSpy();
            var task2 = jasmine.createSpy();
            var poller = new Poller();
            spyOn(poller, "stop").and.callThrough();
            poller.addPollingTask("poller.test.1", task1, 50);
            poller.addPollingTask("poller.test.2", task2, 100);
            poller.start().then(function () {
                expect(poller.isStarted()).toBe(true);
                expect(poller.isStopped()).toBe(false);
                poller.clearTasks().then(function () {
                    expect(poller.stop).toHaveBeenCalled();
                    expect(poller.isStarted()).toBe(false);
                    expect(poller.isStopped()).toBe(true);
                });
            });
            $rootScope.$apply();
        });

    });

});
