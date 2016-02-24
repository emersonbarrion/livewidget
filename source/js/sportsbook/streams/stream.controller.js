(function(angular) {
    "use strict";

    function streamController($scope, streamService, $log, $sce) {
        $scope.isLoading = false;
        $scope.isError = false;
        $scope.url = "";
        $scope.errorMessage = "";

        $scope.load = function () {
            $scope.isLoading = true;

            streamService.getStreamData({
                "segment": $scope.segment,
                "language": $scope.language,
                "streamType": $scope.stream.type,
                "provider": $scope.stream.provider,
                "streamId": $scope.stream.id,
                "eventId": $scope.stream.event.id,
                "isMobile": $scope.isMobile,
                "sessionId": $scope.sessionId,
                "streamWidth": $scope.streamWidth,
                "streamOnly": $scope.streamOnly
            }).then(function(streamData) {
                if(streamData.url){
                    $scope.streamData = streamData;
                    $scope.isError = false;
                    $scope.url = $sce.trustAsResourceUrl(streamData.url);
                    var flashvars = {};

                    if(streamData.providerId === 1 && streamData.streamType === 1) {
                        console.log("PERFORM");
                        flashvars = {
                            liveURL: streamData.url,
                            partnerId: streamData.params.partnerId,
                            key: streamData.params.key,
                            eventId: streamData.params.eventId,
                            userId: streamData.params.userId
                        };

                        /*$("#performstream").flash({
                            swf: "/templates/sportsbook/streams/PerformLivePlayer.swf",
                            width: "100%",
                            height: "100%",
                            version: "9.0.124",
                            flashvars: flashvars,
                            quality: "high",
                            menu: "false",
                            scale: "showAll",
                            allowFullscreen: "false",
                            allowScriptAccess: "always",
                            bgcolor: "#000000",
                            id: "StreamPlayer",
                            name: "StreamPlayer",
                            align: "middle"
                        });*/
                    } else if(streamData.providerId === 2 && streamData.streamType === 1) {
                        console.log("SPORTSMAN");

                        flashvars = {
                            sportsManUrl: streamData.url
                        };

                        /*$('#sportsmanstream').flash(
                            {
                                //swf: "streamPlayer/sportsman/AkamaiFlashPlayer.swf",
                                width: "100%",
                                height: "100%",
                                version: "9.0.124",
                                flashvars: flashvars,
                                quality: "high",
                                menu: "false",
                                scale: "showAll",
                                allowFullscreen: "false",
                                allowScriptAccess: "always",
                                bgcolor: "#000000",
                                id: "StreamPlayer",
                                name: "StreamPlayer",
                                align: "middle",
                                params: { allowFullScreen: 'false' },
                                attributes: {id:"myPlayer",name:"myPlayer"}
                            }
                        );*/
                    }
                } else {
                    $scope.isError = true;
                    $scope.errorMessage = streamData.errorMessage;
                }
            }).catch(function(reason) {
                $scope.isError = true;
                $scope.errorMessage = reason.data.Errors[0].Message;
                $log.log(reason);
            }).finally(function () {
                $scope.isLoading = false;
            });
        };

        $scope.reload = function() {
            if ($scope.isLoading) {
                return;
            }

            $scope.load();
        };

        $scope.reload();
    }

    angular.module("sportsbook.streams")
        .controller("streamCtrl", ["$scope", "streamService", "$log", "$sce", streamController]);
})(angular);