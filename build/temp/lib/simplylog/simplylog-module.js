(function (S, SL) {

    var simplyLogModule = angular.module("SimplyLog", ["Simple", "Simple.Data"]);
    simplyLogModule.service("simplyLogApiClient", SL.ApiClient);
    simplyLogModule.service("entityAttachmentsDataService", SL.EntityAttachmentsDataService);
    simplyLogModule.service("equipmentDataService", SL.EquipmentDataService);
    simplyLogModule.service("employeeDataService", SL.EmployeeDataService);
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
            client_secret: "HgJQOHO6jgYORkDYUF5lQb5vYvXOOhs7WbG0mtF90HQ=",
            client_id: "369c5d3c-6b11-4a1a-97ae-1c49c2e62a64",
            grant_type: "password",
            resource: "https://simplylogapi.ylm.co.il",
        });
    }]);

    simplyLogModule.service("appState", ["$q", function($q) {
        var state = {};

        return {
            get: getState,
            set: setState,
            save: save,
            load: load
        };


        function getState(key) {
            
            return $q.when(state[key]);
        }

        function setState(key, value) {
            state[key] = value;
            
            return $q.when(value);
        }

        function save() { }

        function load() {}
    }]);

    simplyLogModule.controller("AppCtrl", SL.AppController);
    simplyLogModule.controller("LoginCtrl", SL.LoginController);
    simplyLogModule.controller("ConfigurationCtrl", SL.ConfigurationController);
    simplyLogModule.controller("SelectLocationCtrl", SL.SelectLocationController);
    simplyLogModule.controller("SelectCategoryCtrl", SL.SelectCategoryController);
    simplyLogModule.controller("SelectEquipmentCtrl", SL.SelectEquipmentController);
    simplyLogModule.controller("SelectSeverityCtrl", SL.SelectSeverityController);
    simplyLogModule.controller("AttachmentsCtrl", SL.AttachmentsController);
    simplyLogModule.directive("incidentDetails", SL.IncidentDetailsDirective);
    simplyLogModule.directive("splitContent", SL.SplitContentDirective);
    simplyLogModule.directive("browser", S.BrowserDirective);

    simplyLogModule.run(["configurationManager", function (configurationManager) {
        configurationManager.load();
    }]);



})(Simple, SimplyLog);
