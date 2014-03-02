(function (S, SL) {

    var simplyLogModule = angular.module("SimplyLog", ["Simple", "Simple.Data"]);
    simplyLogModule.service("simplyLogApiClient", SL.ApiClient);
    simplyLogModule.service("equipmentDataService", SL.EquipmentDataService);
    simplyLogModule.service("categoryDataService", SL.CategoryDataService);
    simplyLogModule.service("locationDataService", SL.LocationDataService);
    simplyLogModule.service("incidentDataService", SL.IncidentDataService);
    simplyLogModule.service("incidentsService", SL.IncidentsService);
    simplyLogModule.service("locationsService", SL.LocationsService);
    simplyLogModule.service("equipmentsManager", SL.EquipmentsManager);
    simplyLogModule.service("entityUpdateProcessor", SL.EntityUpdateProcessor);
    simplyLogModule.service("updateManager", SL.UpdateManager);

    simplyLogModule.config(["azureActiveDirectoryProvider", function (azureActiveDirectory) {
        azureActiveDirectory.configure("simplylog.co.il", {
            client_id: "HgJQOHO6jgYORkDYUF5lQb5vYvXOOhs7WbG0mtF90HQ=",
            client_secret: "369c5d3c-6b11-4a1a-97ae-1c49c2e62a64",
            grant_type: "password",
            resource: "https://simplylogapi.ylm.co.il",
        });
    }]);


    simplyLogModule.controller("AppCtrl", SL.AppController);
    simplyLogModule.controller("LoginCtrl", SL.LoginController);
    simplyLogModule.controller("ConfigurationCtrl", SL.ConfigurationController);
    simplyLogModule.directive("incidentDetails", SL.IncidentDetailsDirective);

    simplyLogModule.run(function ($rootScope, $location, loginManager, navigate, network) {
        // register listener to watch route changes
 

    });

    simplyLogModule.run(function (configurationManager) {
        configurationManager.load();
    });



})(Simple, SimplyLog);
