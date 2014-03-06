(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", function ($scope, $location, eventReportManager, employeeService) {

        $scope.changeHeader({
            header: "ManagerReport",
            back: true
        });

        $scope.managerScanEnter = function () {
            $scope.status = "enter";
            console.log("scanEnter");
        };
        
        $scope.managerScanExit = function () {
            $scope.status = "exit";
            console.log("scanExit");
        };

        eventReportManager.getEvents().then(function (items) {
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