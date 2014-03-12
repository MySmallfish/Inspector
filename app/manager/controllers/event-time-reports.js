(function (S, I) {
    I.EventTimeReportsController = ["$q", "$scope", "$routeParams", "eventReportManager", "employeeService", function ($q, $scope, $routeParams, eventReportManager, employeeService) {

        $scope.changeHeader({
            header: "EventTimeReports",
            back: true
        });

        eventReportManager.getEventById($routeParams.eventId).then(function (item) {
            $scope.event = item;

            eventReportManager.getReportsByEventId($routeParams.eventId).then(function (items) {
                if (items) {
                    $scope.timeReports = items;
                }
            });
        });

        $scope.timeReports = [];
  
    }];
})(Simple, Simple.Inspector);