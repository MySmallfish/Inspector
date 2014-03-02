(function (S, SL) {

    SL.UpdateManager = [
        "$q",
        "incidentDataService",
        "equipmentDataService",
        "locationDataService",
        "categoryDataService",
        function ($q, incidentDataService, equipmentDataService, locationDataService, categoryDataService) {

            function updateProgress(stepName) {
                return function (context) {
                    console.log("Progress: ", stepName);
                    return context;
                };
            }

            function performLoginUpdate() {

                return $q.when({}).then(updateProgress("Started...")).then(
                    function () {
                        return $q.all([
                            equipmentDataService.fetchEquipments().then(updateProgress("Equipments Loaded")),
                            equipmentDataService.fetchEquipmentTypes().then(updateProgress("EquipmentTypes Loaded")),
                            locationDataService.fetchSiteGeoGroups().then(updateProgress("SiteGeoGroups Loaded")),
                            locationDataService.fetchSites().then(updateProgress("Sites Loaded")),
                            locationDataService.fetchBuildings().then(updateProgress("Buildings Loaded")),
                            locationDataService.fetchCells().then(updateProgress("Cells Loaded")),
                            categoryDataService.fetchCategories().then(updateProgress("Categories Loaded")),
                            incidentDataService.fetchSeverities().then(updateProgress("Severities Loaded"))
                        ]);
                    }).then(updateProgress("Completed."));
            }

            return {
                run: performLoginUpdate
            };

        }];
})(Simple, SimplyLog)
