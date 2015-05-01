(function (S, SL) {

    SL.SelectSeverityController = [
        "$scope", "$routeParams", "utils", "$location", "safeApply", "incidentDataService", "$q","textResource",
        function ($scope, $routeParams, utils, $location, safeApply, incidentDataService, $q, textResource) {
            $scope.changeHeader(textResource.get("SelectSeverity"));
            function loadSeverities() {
                incidentDataService.getSeverities().then(function(severities) {
                    return _.map(severities, function(severity) {
                        var item = {
                            Id: severity.Id,
                            Text: severity.Name,
                            ColorHint: utils.color.fromRGBValue(severity.Color)
                        };
                        return item;
                    });
                }).then(function(severities) {
                    $scope.severities = severities;
                });
            }

            loadSeverities();

            $scope.confirmSelection = function () {

                if ($scope.selectedSeverity) {
                    var parameters = {
                        stateId: $routeParams.stateId
                    };
                    parameters[$routeParams.parameterName + "Id"] = $scope.selectedSeverity.Id;

                    $location.path("NewIncident").search(parameters);
                }
            };

        }
    ];

})(Simple, SimplyLog);

