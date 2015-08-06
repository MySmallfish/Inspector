(function (S, SL) {

    SL.SelectEquipmentController = [
        "$scope", "$routeParams", "utils", "$location", "safeApply", "equipmentDataService", "$q","textResource",
        function ($scope, $routeParams, utils, $location, safeApply, equipmentDataService, $q, textResource) {
            $scope.changeHeader(textResource.get("SelectEquipment"));
            function loadEquipments() {
                var parameters = {};
                if ($routeParams.limitPath) {
                    parameters.Location = { Path: decodeURIComponent($routeParams.limitPath) };
                }

                return $q.all([
                    $routeParams.limitPath?  equipmentDataService.getEquipmentTypesFromEquipments(parameters) : equipmentDataService.getEquipmentTypes(),
                    equipmentDataService.getEquipments(parameters)
                ]).then(function(results) {
                    var items = _.map(results[0], function(item) {
                        return {
                            Id: item.Id,
                            Text: item.Name,
                            EntityName: "EquipmentType",
                            HasChildren:true
                        };
                    });

                    items = _.union(items, _.map(results[1], function(equipment) {
                        return {
                            Id: equipment.Id,
                            Text: equipment.Name,
                            EntityName: "Equipment",
                            ParentId: equipment.EquipmentTypeId
                        };
                    }));
                    return items;
                }).then(function(items) {
                    $scope.equipments = items;
                });
            }

            loadEquipments();

            $scope.confirmSelection = function () {
                if ($scope.selectedEquipment) {
                    var parameters = {
                        stateId: $routeParams.stateId
                    };
                    parameters[$routeParams.parameterName + "Id"] = $scope.selectedEquipment.Id;
                    $location.path("NewIncident").search(parameters);
                }
            };
        }
    ];

})(Simple, SimplyLog);

