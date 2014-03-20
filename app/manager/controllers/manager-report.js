(function (S, I) {
    I.ManagerReportController = ["$scope", "$location", "eventReportManager", "employeeService", "timeReportManager", "loginManager","$timeout",
        function ($scope, $location, eventReportManager, employeeService, timeReportManager, loginManager, $timeout) {
            
            console.log("S", $scope.$root.lastSelectedEventId);
            function loadEvents(userid) {
                eventReportManager.getEvents(userid).then(function (items) {
                    $scope.events = items;
                    $timeout(function () {
                        $scope.selectedEventId = $scope.$root.lastSelectedEventId;
                    },100);
                });
            }

            $scope.$watch("selectedEventId", function (value) {
                $scope.$root.lastSelectedEventId = value;
            });

            loginManager.getCurrentUser().then(function (item) {
                $scope.userid = item.UserId;
                return item.UserId;
            }).then(loadEvents);

            $scope.changeHeader({
                header: "ManagerReport",
                back: true
            });

            $scope.isEnter = true;

            $scope.managerScanEnter = function () {

                console.log("$scope", $scope);
                $scope.isEnter = true;
                $scope.$root.$broadcast("report-status-selected");
            };

            $scope.managerScanExit = function () {
                $scope.isEnter = false;
                $scope.$root.$broadcast("report-status-selected");
            };

            $scope.$watch("reportBarCode", function (employeeCode) {
                employeeService.getIdByCode($scope.userid, employeeCode).then(function (item) {
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