(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", "timeReportManager", function ($scope, $location, eventReportManager, employeeService, timeReportManager) {

        var userid = 3359;

        $scope.changeHeader({
            header: "ManagerReport",
            back: true
        });

        $scope.isEnter = true;

        $scope.managerScanEnter = function () {
            $scope.isEnter = true;
            $scope.$root.$broadcast("report-status-selected");
            console.log("scanEnter");
        };

        $scope.managerScanExit = function () {
            $scope.isEnter = false;
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
            console.log("HERE??", newReport);

            timeReportManager.addTimeReport(newReport);
            

            $scope.navigateToEventReports();
        };
    }];
})(Simple, Simple.Inspector);