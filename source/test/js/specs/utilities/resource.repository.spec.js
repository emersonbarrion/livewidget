
describe("Utility: Resource repository", function () {

    var repositoryManager;

    beforeEach(module("angular-sitestack-utilities"));
    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["resourceRepository", function (_repositoryManager_) {
        repositoryManager = _repositoryManager_;
    }]));

    it("should create a repository on request if it does not already exist", function () {

        expect(_.keys(repositoryManager.repositories).length).toEqual(0);

        // First call. This should create a new repository as the manager does not have a repository with this name.
        var testRepository = repositoryManager.get("testCreate");

        var keysAfterFirstCall = _.keys(repositoryManager.repositories);
        expect(keysAfterFirstCall.length).toEqual(1);
        expect(keysAfterFirstCall[0]).toEqual("testCreate");
        expect(repositoryManager.repositories.testCreate).toBe(testRepository);

        // Subsequent calls should return the same instance of the repository.
        var testRepository2 = repositoryManager.get("testCreate");
        var keysAfterSecondCall = _.keys(repositoryManager.repositories);
        expect(keysAfterSecondCall.length).toEqual(1);
        expect(keysAfterSecondCall[0]).toEqual("testCreate");
        expect(testRepository2).toBe(testRepository);
        expect(repositoryManager.repositories.testCreate).toBe(testRepository);
    });

    it("should remove orphaned resources from the repository if all the datasources supporting them are removed.", function () {

        var testRepository = repositoryManager.get("testRemoval");

        testRepository.dataSourcesByResourceId[1] = ["a", "b", "c"];
        testRepository.dataSourcesByResourceId[2] = ["a", "c"];
        testRepository.dataSourcesByResourceId[3] = ["b"];

        testRepository.resourceIdsByDataSource.a = [1, 2];
        testRepository.resourceIdsByDataSource.b = [1, 3];
        testRepository.resourceIdsByDataSource.c = [1, 2];

        testRepository.resourcesById[1] = {
            "id": 1,
            "timestamp": new Date()
        };
        testRepository.resourcesById[2] = {
            "id": 2,
            "timestamp": new Date()
        };
        testRepository.resourcesById[3] = {
            "id": 3,
            "timestamp": new Date()
        };

        expect(_.keys(testRepository.dataSourcesByResourceId).length).toEqual(3);
        expect(_.keys(testRepository.resourceIdsByDataSource).length).toEqual(3);
        expect(_.keys(testRepository.resourcesById).length).toEqual(3);

        testRepository.removeDataSource("b");

        // All entries referring to datasource b should be removed.
        expect(_.keys(testRepository.resourceIdsByDataSource).length).toEqual(2);
        expect(testRepository.resourceIdsByDataSource.b).toBeUndefined();

        // Resource 3 should be removed as it was only supported by datasource b.
        // Resource 1 and 2 should be unaffected as 2 does not rely on b, and 1 is also supported by a and c.
        expect(_.keys(testRepository.dataSourcesByResourceId).length).toEqual(2);
        expect(_.keys(testRepository.resourcesById).length).toEqual(2);

        // The data source list for resource 1 should indicate that b is no longer available.
        expect(testRepository.dataSourcesByResourceId[1].length).toEqual(2);
        expect(testRepository.dataSourcesByResourceId[1][0]).toEqual("a");
        expect(testRepository.dataSourcesByResourceId[1][1]).toEqual("c");
    });

    it("should detect when new resources are added", function () {

        var repository = repositoryManager.get("testAddResource");

        var data = [{
            "id": 1,
            "value": "a"
        }, {
            "id": 2,
            "value": "a"
        }, {
            "id": 3,
            "value": "a"
        }];

        var newDataByDataSourceName = {
            "addingDs": data
        };

        var changeSummary = repository.update(newDataByDataSourceName, _.identity, _.identity, _.noop, _.noop);

        // The resource data should be stored in the repository.
        expect(repository.resourcesById[1]).toBe(data[0]);
        expect(repository.resourcesById[2]).toBe(data[1]);
        expect(repository.resourcesById[3]).toBe(data[2]);

        // The data source should be associated with the resource.
        var expectedResourceList = [1, 2, 3];
        expect(repository.resourceIdsByDataSource.addingDs).toEqual(expectedResourceList);

        // The resources should be associated with their data source.
        var expectedDataSourceList = ["addingDs"];
        expect(repository.dataSourcesByResourceId[1]).toEqual(expectedDataSourceList);
        expect(repository.dataSourcesByResourceId[2]).toEqual(expectedDataSourceList);
        expect(repository.dataSourcesByResourceId[3]).toEqual(expectedDataSourceList);

        // The change summary should reflect the additions.
        expect(changeSummary.addingDs.updates).toBeUndefined();
        expect(changeSummary.addingDs.removed).toBeUndefined();
        expect(changeSummary.addingDs.added).toBeUndefined();
        expect(changeSummary.addingDs.initialised).toEqual({
            1: data[0],
            2: data[1],
            3: data[2]
        });
    });

    it("should detect resource removal", function () {

        var repository = repositoryManager.get("testRemoveResource");

        repository.dataSourcesByResourceId[1] = ["a", "b"];
        repository.dataSourcesByResourceId[2] = ["a"];

        repository.resourceIdsByDataSource["a"] = [1, 2];
        repository.resourceIdsByDataSource["b"] = [1];

        repository.resourcesById[1] = {
            "id": 1
        };
        repository.resourcesById[2] = {
            "id": 2
        };

        var data = [{
            "id": 1
        }];

        var newDataByDataSourceName = {
            "a": data
        };

        var changeSummary = repository.update(newDataByDataSourceName, _.identity, _.identity, _.noop,  _.noop);

        // Resource 2 is no included in the data for dataSource "a". Since it is only supported by
        // that data source, it should be removed.
        expect(repository.resourceIdsByDataSource.a).toEqual([1]);

        var deletedData = [
            { "id": 2 }
        ];

        // The change summary should indicate that resource 2 was removed.
        expect(changeSummary.a.updates).toBeUndefined();
        expect(changeSummary.a.initialised).toBeUndefined();
        expect(changeSummary.a.added).toBeUndefined();
        expect(changeSummary.a.removed).toEqual(deletedData);
    });

    it("should detect resource changes", function () {
        var repository = repositoryManager.get("testUpdateResource");

        repository.dataSourcesByResourceId[1] = ["a", "b"];
        repository.dataSourcesByResourceId[2] = ["a"];

        repository.resourceIdsByDataSource.a = [1, 2];
        repository.resourceIdsByDataSource.b = [1];

        repository.resourcesById[1] = {
            "id": 1,
            "value": 1
        };
        repository.resourcesById[2] = {
            "id": 2,
            "value": 2
        };

        var data = [{
            "id": 1,
            "value": 3
        }, {
            "id": 2,
            "value": 2
        }];

        var diffFunction = function (oldResource, newResource) {
            return (oldResource.value === newResource.value) ? null : {
                "id": 1,
                "value": newResource.value,
                "oldValue": oldResource.value
            }
        };

        var mergeFunction = function (instance, changes) {
            instance.value = changes.value;
        };

        var newDataByDataSourceName = {
            "a": data
        };

        var changeSummary = repository.update(newDataByDataSourceName, _.identity, _.identity, diffFunction, mergeFunction);

        // Changes should be reflected in the repository data.
        expect(repository.resourcesById[1].value).toBe(3);

        var updates = {
            1: {
                "id": 1,
                "value": 3,
                "oldValue": 1
            }
        };

        expect(changeSummary.a.updates).toEqual(updates);

        expect(changeSummary.a.initialised).toBeUndefined();
        expect(changeSummary.a.removed).toBeUndefined();
        expect(changeSummary.a.added).toBeUndefined();

        expect(changeSummary.b.updates).toEqual(updates);

        expect(changeSummary.b.initialised).toBeUndefined();
        expect(changeSummary.b.removed).toBeUndefined();
        expect(changeSummary.b.added).toBeUndefined();
    });
});
