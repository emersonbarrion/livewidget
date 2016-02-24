/*describe("Service: Stream Client", function() {

    var streamVideo, $httpBackend;
    var responseData = {
        success: {
            k: "dd65f3e54502efc1c59c8f8af0919ae9",
            lu: "https://streamaccess.unas.tv/flash/10/285811.xml?streamid=285811&partnerid=10&label=&unikey=&timestamp=20151209143317&auth=dd65f3e54502efc1c59c8f8af0919ae9",
            ptid: "10",
            rc: "status.livestreaming.success",
            s: 0
        },
        error: {
            Errors: [
                {
                    Code: 131,
                    Message: "Not Logged in. No game session with token eb98acc5-3c43-4907-b417-00c0ad581f69 was found in the cache."
                }
            ]
        }
    };

    beforeEach(module("sportsbook.streams"));
    beforeEach(inject(["streamVideo", "$httpBackend", function(client, _$httpBackend_){
        streamVideo = client;
        $httpBackend = _$httpBackend_;
    }]));

    it("should return livestream details for a specific event", function(done){
        $httpBackend.when("GET", "https://sbsitefacade.bpsgameserver.com/isa/v2/111/en/stream/1/2/3?eventId=4&isMobile=false&sessionId=5").respond(responseData.success);

        streamVideo
            .getStream({
                "eventId": 4,
                "streamId": 3,
                "segment": 111,
                "language": "en",
                "streamType": 1,
                "provider": 2,
                "sessionId": 5,
                "isMobile": false
            })
            .then(function(data){
                expect(data.k).toBe("dd65f3e54502efc1c59c8f8af0919ae9");

                done();
            });

        $httpBackend.flush();
    });

    it("should return error details if something is wrong with the request", function(done){
        $httpBackend.when("GET", "https://sbsitefacade.bpsgameserver.com/isa/v2/111/en/stream/1/2/3?eventId=4&isMobile=false&sessionId=5").respond(responseData.error);

        streamVideo
            .getStream({
                "eventId": 4,
                "streamId": 3,
                "segment": 111,
                "language": "en",
                "streamType": 1,
                "provider": 2,
                "sessionId": 5,
                "isMobile": false
            })
            .then(function(data){
                expect(data.Errors[0].Message).toBe("Not Logged in. No game session with token eb98acc5-3c43-4907-b417-00c0ad581f69 was found in the cache.");

                done();
            });

        $httpBackend.flush();
    });
});*/