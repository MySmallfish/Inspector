(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", function ($scope, $location, eventReportManager, employeeService) {

        var userid = 3359;

        $scope.changeHeader({
            header: "ManagerReport",
            back: true
        });

        $scope.managerScanEnter = function () {
            $scope.$root.reportStatus = "enter";
            $scope.$root.$broadcast("report-status-selected");
            console.log("scanEnter");
        };
        
        $scope.managerScanExit = function () {
            $scope.$root.reportStatus = "exit";
            $scope.$root.$broadcast("report-status-selected");
            console.log("scanExit");
        };

        eventReportManager.getEvents(userid).then(function (items) {
            $scope.events = items;
        });

        $scope.$watch("reportBarCode", function (employeeCode) {
            employeeService.getEmployeeByCode(employeeCode).then(function (item) {
                $scope.employee = item;
            })
        });

        $scope.clearEmployee = function () {
            $scope.reportBarCode = null;
        };

        $scope.navigateToEventReports = function(){
            $location.path("/EventTimeReports");
        }
    }];
})(Simple, Simple.Inspector);