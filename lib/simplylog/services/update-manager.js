(function (S, SL) {

    SL.UpdateManager = [
        "$q",
        "incidentDataService",
        "equipmentDataService",
        "locationDataService",
        "categoryDataService",
        "employeeDataService",
        "entityAttachmentsDataService",
        function ($q, incidentDataService, equipmentDataService, locationDataService, categoryDataService, employeeDataService, entityAttachmentsDataService) {

            function updateProgress(stepName) {
                return function (context) {
                    return context;
                };
            }

            function performLoginUpdate() {

                return $q.when({}).then(updateProgress("Started...")).then(
                    function () {
                        return $q.all([
                            employeeDataService.fetchEmployees().then(updateProgress("Employees Loaded")),
                            equipmentDataService.fetchEquipments().then(updateProgress("Equipments Loaded")),
                            equipmentDataService.fetchEquipmentTypes().then(updateProgress("EquipmentTypes Loaded")),
                            locationDataService.fetchSiteGeoGroups().then(updateProgress("SiteGeoGroups Loaded")),
                            locationDataService.fetchSites().then(updateProgress("Sites Loaded")),
                            locationDataService.fetchBuildings().then(updateProgress("Buildings Loaded")),
                            locationDataService.fetchCells().then(updateProgress("Cells Loaded")),
                            categoryDataService.fetchCategories().then(updateProgress("Categories Loaded")),
                            incidentDataService.fetchSeverities().then(updateProgress("Severities Loaded")),
                            entityAttachmentsDataService.fetchAttachments().then(updateProgress("Attachments Loaded"))
                        ]);
                    }).then(updateProgress("Completed."));
            }

            return {
                run: performLoginUpdate
            };

        }];
})(Simple, SimplyLog)
