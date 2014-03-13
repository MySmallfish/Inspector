(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", "timeReportManager", function ($scope, $location, eventReportManager, employeeService, timeReportManager) {

        var userid = 3359;

        $scope.changeHeader({
            header: "ManagerReport",
            back: true
        });

        $scope.isEnter = true;

        $scope.managerScanEnter = function () {
            $scope.reportBarCode = null;
            console.log("$scope", $scope);
            $scope.isEnter = true;
            $scope.$root.$broadcast("report-status-selected");
        };

        $scope.managerScanExit = function () {
            $scope.reportBarCode = null;
            console.log("$scope", $scope);
            $scope.isEnter = false;
            $scope.$root.$broadcast("report-status-selected");
        };

        eventReportManager.getEvents(userid).then(function (items) {
            $scope.events = items;
        });

        $scope.$watch("reportBarCode", function (employeeCode) {
            employeeService.getIdByCode(userid, employeeCode).then(function (item) {
                if (employeeCode) {
                    $scope.employee = item;
                }
            })
        });

        $scope.clearEmployee = function () {
            $scope.employee = null;
            $scope.reportBarCode = null;
        };

        $scope.navigateToEventReports = function () {
            $location.path("/EventTimeReports/" + $scope.selectedEventId);
        }

        function buildReport() {
            var report = {
                employeeId: $scope.employee.Id,
                isEnter: $scope.isEnter,
                employeeCode: $scope.reportBarCode,
                eventId: $scope.selectedEventId
            };
            return report;
        };

        $scope.report = function () {
            var newReport = buildReport();
            timeReportManager.addTimeReport(newReport);
            $scope.clearEmployee();
        };
    }];
})(Simple, Simple.Inspector);