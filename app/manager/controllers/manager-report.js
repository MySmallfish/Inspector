(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", "timeReportManager", "loginManager","$timeout",
        function ($scope, $location, eventReportManager, employeeService, timeReportManager, loginManager, $timeout) {
            var selectedEventId = $scope.$root.lastSelectedEventId;
            function loadEvents(userid) {
                eventReportManager.getEvents(userid).then(function (items) {
                    $scope.events = items;
                    $timeout(function () {
                        $scope.selectedEventId = selectedEventId;
                    });
                });
            }

            function managerScanEnter() {
                $scope.isEnter = true;
                $scope.$root.$broadcast("report-status-selected");
            };

            function managerScanExit() {
                $scope.isEnter = false;
                $scope.$root.$broadcast("report-status-selected");
            };

            function clearEmployee() {
                $scope.employee = null;
                $scope.reportBarCode = null;
            };

            function navigateToEventReports() {
                $location.path("/EventTimeReports/" + $scope.selectedEventId);
            };

            function buildReport() {
                var employeeReport = {
                    employee: { Id: $scope.employee.Id, Name: $scope.employee.Name },
                    isEnter: $scope.isEnter,
                    eventId: $scope.selectedEventId
                };
                return employeeReport;
            };

            function report() {
                var newReport = buildReport();
                timeReportManager.addTimeReport(newReport);
                $scope.clearEmployee();
            };

            _.extend($scope, {
                managerScanEnter: managerScanEnter,
                managerScanExit: managerScanExit,
                clearEmployee: clearEmployee,
                navigateToEventReports: navigateToEventReports,
                report: report
            });
            
            $scope.changeHeader({
                header: "ManagerReport",
                back: true
            });

            $scope.$watch("selectedEventId", function (value) {
                $scope.$root.lastSelectedEventId = value;
            });

            $scope.$watch("reportBarCode", function (employeeCode) {
                employeeService.getEmployeeByCode($scope.userid, employeeCode).then(function (item) {
                    if (employeeCode) {
                        $scope.employee = item;
                    }
                });
            });

            $scope.isEnter = true;

            function loadUser() {
                loginManager.getCurrentUser().then(function(item) {
                    $scope.userid = item.UserId;
                    return item.UserId;
                }).then(loadEvents);
            }            
            
            $scope.notifyProgressStarted()
            .then(loadUser)
            .finally($scope.notifyProgressCompleted);

        }];
})(Simple, Simple.Inspector);