describe("Utility: Lodash Mixins", function () {

    describe("removeFromDict", function () {

        var dragons;

        var getDragons = function () {
            return {
                "37452": {
                    "name": "Fluffy",
                    "type": "fire",
                    "colours": [
                        "orange",
                        "red"
                    ]
                },
                "74556": {
                    "name": "Derolth",
                    "type": "ice",
                    "colours": [
                        "white"
                    ]
                },
                "23242": {
                    "name": "Verath",
                    "type": "fire",
                    "colours": [
                        "red",
                        "brown"
                    ]
                },
                "32425": {
                    "name": "Jevith",
                    "type": "electric",
                    "colours": [
                        "black",
                        "blue"
                    ]
                }
            };
        }

        beforeEach(function () {
            dragons = getDragons();
        });

        it("should remove a key from a dictionary based on a function predicate", function () {
            expect(_.keys(dragons).length).toBe(4);

            var isRedFireDragon = function (dragon) {
                return dragon.type === "fire" && _.includes(dragon.colours, "red");
            };

            _.removeFromDict(dragons, isRedFireDragon);

            expect(_.keys(dragons).length).toBe(2);
            expect(_.chain(dragons).keys().includes(37452).value()).toBe(false);
            expect(_.chain(dragons).keys().includes(23242).value()).toBe(false);
        });

        it("should remove a key from a dictionary based on an object match predicate", function () {
            expect(_.keys(dragons).length).toBe(4);

            var redFireDragonMatch = {
                "type": "fire",
                "colours": ["red"]
            };

            _.removeFromDict(dragons, redFireDragonMatch);

            expect(_.keys(dragons).length).toBe(2);
            expect(_.chain(dragons).keys().includes(37452).value()).toBe(false);
            expect(_.chain(dragons).keys().includes(23242).value()).toBe(false);
        });

        it("should remove a key from a dictionary based on a value match", function () {
            expect(_.keys(dragons).length).toBe(4);

            _.removeFromDict(dragons, dragons["37452"]);

            expect(_.keys(dragons).length).toBe(3);
            expect(_.chain(dragons).keys().includes(37452).value()).toBe(false);
        });

        it("should remove a key from a dictionary based on a primitive value match", function () {
            var dictionary = {
                "37452": 10,
                "74556": 15,
                "23242": 10,
                "32425": 9
            };

            expect(_.keys(dictionary).length).toBe(4);

            _.removeFromDict(dictionary, 10);

            expect(_.chain(dictionary).keys().includes(37452).value()).toBe(false);
            expect(_.chain(dictionary).keys().includes(23242).value()).toBe(false);
        });

    });

});
