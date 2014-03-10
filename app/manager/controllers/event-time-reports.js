(function (S, I) {
    I.EventTimeReportsController = ["$scope", "eventReportManager", "employeeService", function ($scope, eventReportManager, employeeService) {

        $scope.changeHeader({
            header: "EventTimeReports",
            back: true
        });

        eventReportManager.getEventById(11).then(function (item) {
            $scope.event = item;
        });

        $scope.$on("report-status-selected", function (item) {
            console.log("here???", item);
        });
        //$scope.reportStatus = managerReport.reportStatus;
  
    }];
})(Simple, Simple.Inspector);