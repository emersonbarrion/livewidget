describe("Adapter: Scoreboard", function() {

    var adapter;

    var singleFootballScoreboardResponse =
    {
        "ei": 664828,
        "ci": 1,
        "pl": [
            {
                "pi": 149240,
                "pn": "participant 2"
            },
            {
                "pi": 149239,
                "pn": "participant 1"
            }
        ],
        "gal": [],
        "gsl": [
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 13,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 1,
                "spi": 149240,
                "v": "1"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 7,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 7,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 2,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 12,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 2,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 3,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 13,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 12,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 3,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 3,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 1,
                "spi": 149240,
                "v": "1"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 12,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 1,
                "spi": 149239,
                "v": "1"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 12,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 2,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 13,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 3,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 7,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 1,
                "spi": 149239,
                "v": "1"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 2,
                "spi": 149239,
                "v": "0"
            },
            {
                "gpi": 15,
                "gpn": "",
                "sti": 13,
                "spi": 149240,
                "v": "0"
            },
            {
                "gpi": 1,
                "gpn": "1st half",
                "sti": 7,
                "spi": 149240,
                "v": "0"
            }
        ],
        "gcp": {
            "gpi": 1,
            "gpn": "1st half"
        },
        "gmc": {
            "s": 0,
            "m": 0,
            "mcm": 0,
            "lu": "0001-01-01T00:00:00"
        }
    };

    var singleBaseballScoreboardResponse = { "ei": 665009, "ci": 19, "pl": [{ "pi": 155405, "pn": "BIBIBI" }, { "pi": 155404, "pn": "POPOPO" }], "gal": [], "gsl": [{ "gpi": 23, "gpn": "16th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 17, "spi": 155404, "v": "0" }, { "gpi": 7, "gpn": "7th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 2, "gpn": "2nd Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 18, "gpn": "11th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 24, "gpn": "17th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 9, "gpn": "9th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 21, "gpn": "14th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 20, "gpn": "13th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 18, "gpn": "11th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 2, "gpn": "2nd Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 1, "spi": 155405, "v": "1" }, { "gpi": 6, "gpn": "6th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 10, "gpn": "10th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 6, "gpn": "6th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 1, "gpn": "1st Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 10, "spi": 155404, "v": "0" }, { "gpi": 22, "gpn": "15th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 3, "gpn": "3rd Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 20, "gpn": "13th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 21, "gpn": "14th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 24, "gpn": "17th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 10, "spi": 155405, "v": "1" }, { "gpi": 4, "gpn": "4th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 4, "gpn": "4th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 1, "gpn": "1st Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 19, "gpn": "12th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 17, "spi": 155405, "v": "0" }, { "gpi": 8, "gpn": "8th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 9, "gpn": "9th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 8, "gpn": "8th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 22, "gpn": "15th Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 14, "gpn": "", "sti": 1, "spi": 155404, "v": "0" }, { "gpi": 19, "gpn": "12th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 3, "gpn": "3rd Inning", "sti": 22, "spi": 155404, "v": "0" }, { "gpi": 7, "gpn": "7th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 22, "spi": 155405, "v": "1" }, { "gpi": 23, "gpn": "16th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 10, "gpn": "10th Inning", "sti": 22, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 18, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 19, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 20, "spi": 155405, "v": "0" }, { "gpi": 5, "gpn": "5th Inning", "sti": 21, "spi": 155405, "v": "0" }], "gcp": { "gpi": 5, "gpn": "5th Inning" }, "gmc": { "s": 0, "m": 0, "mcm": 1, "lu": "2015-07-15T15:15:56.2" } };

    beforeEach(module("sportsbook.markets"));

    beforeEach(inject(["scoreboardsAdapter", function (scoreboardsAdapter) {
        adapter = scoreboardsAdapter;
    }]));

    it("should translate the ISA json object into the SiteStack scoreboard format", function() {

        var testEvent = {
            "id": 664828,
            "isLive": true
        };

        var result = adapter.toScoreboard(singleFootballScoreboardResponse, testEvent);

        expect(result).toBeDefined();

        var instance = result;

        var event = instance.event;

        expect(event).toBeDefined();
        expect(event).toBe(testEvent);

        var score = instance.score;

        expect(score).toBeDefined();
        expect(score[149240].total).toBe("1");
        expect(score[149240].byPhase[1]).toBe("1");

        expect(score[149239].total).toBe("1");
        expect(score[149239].byPhase[1]).toBe("1");

        // Match clock mode is 0, which indicates that no support is provided for the match clock.
        // In this case, we return null to indicate that it is not available.
        var matchClock = instance.matchClock;
        expect(matchClock).toBeDefined();
        expect(matchClock).toBe(null);

        var currentPhase = instance.currentPhase;
        expect(currentPhase).toBeDefined();
        expect(currentPhase.id).toBe(1);
        expect(currentPhase.text).toBe("1st half");
    });

    it("should support stats for different sports.", function () {

        var testEvent = {
            "id": 665009,
            "isLive": true
        };

        var result = adapter.toScoreboard(singleBaseballScoreboardResponse, testEvent);

        expect(result).toBeDefined();

        var instance = result;
        console.log(instance);
    });
});
