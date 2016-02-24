describe("Utility: Queue", function() {

    var queueManager, $q, $root;

    beforeEach(module("angular-sitestack-utilities"));

    beforeEach(inject([
        "queue", "$q", "$rootScope", function (_queueManager_, _$q_, _$rootScope_) {
            queueManager = _queueManager_;
            $q = _$q_;
            $root = _$rootScope_;
        }
    ]));

    it("Should create a new queue the first time a task is given to the queue.", function() {

        expect(_.keys(queueManager.queues).length).toEqual(0);

        queueManager.enqueue("a", function () { }, "test");

        var keys = _.keys(queueManager.queues);
        expect(keys.length).toEqual(1);
        expect(keys[0]).toEqual("a");
    });

    it("Should execute tasks in order", function(done) {

        var output = [];
        var a1 = $q.defer();
        var a2 = $q.defer();
        var a3 = $q.defer();

        queueManager.enqueue("a", function () {
                       
            return a1.promise;
        }, "test 1");
        queueManager.enqueue("a", function () {
            output.push("a2"); 
            expect(queueManager.isLoading()).toBe(true);
            return a2.promise;
        }, "test 2");
        queueManager.enqueue("a", function () {
            output.push("a3");
            return a3.promise;
        }, "test 3").then(function () {

            
            expect(queueManager.isLoading()).toBe(false);
            done();
        });

        a1.resolve(1);
        $root.$digest();
        expect(queueManager.isLoading()).toBe(true);
        expect(output).toEqual(["a2"]);

        a2.resolve(2);
        $root.$digest();
        expect(queueManager.isLoading()).toBe(true);
        expect(output).toEqual(["a2", "a3"]);

        a3.resolve(3);
        $root.$digest();        
    });
});