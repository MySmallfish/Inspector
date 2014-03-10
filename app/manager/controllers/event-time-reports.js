(function (S, I) {
    I.EventTimeReportsController = ["$q", "$scope", "eventReportManager", "employeeService", function ($q, $scope, eventReportManager, employeeService) {

        $scope.changeHeader({
            header: "EventTimeReports",
            back: true
        });

        eventReportManager.getEventById(11).then(function (item) {
            $scope.event = item;
        });

        $scope.timeReports = [];

        eventReportManager.getReports().then(function (items) {
            if (items) {
                $scope.timeReports = items;
            }
        });

        //$scope.$on("report-status-selected", function (item) {
        //    console.log("here???", item);
        //});
        //$scope.reportStatus = managerReport.reportStatus;
  
    }];
})(Simple, Simple.Inspector);