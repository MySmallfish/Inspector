(function (S, SL) {

    SL.AttachmentsController = [
        "$scope", "$routeParams", "utils", "$location", "safeApply", "appState", "$q","textResource",
        function ($scope, $routeParams, utils, $location, safeApply, appState, $q, textResource) {
            $scope.changeHeader(textResource.get("SelectAttachments"));
            _.extend($scope, {
                confirmSelection: confirmSelection
            });

            load();

            function loadAttachments(state) {
                if (state && state.incident) {
                    $scope.attachments = state.incident.Attachments || [];
                } else {
                    $scope.attachments = [];
                }
            }

            function confirmSelection() {
                $location.path("NewIncident");
            }

            function load() {
                $scope.maxAttchments = 3;
                if ($routeParams.stateId) {
                    appState.get($routeParams.stateId).then(loadAttachments);
                }
            }
        }
    ];

})(Simple, SimplyLog);

