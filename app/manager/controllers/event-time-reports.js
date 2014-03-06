(function (S, I) {
    I.EventTimeReportsController = ["$scope", "eventReportManager", "employeeService", function ($scope, eventReportManager, employeeService) {

        $scope.changeHeader({
            header: "EventTimeReports",
            back: true
        });

        eventReportManager.getEventById(11).then(function (item) {
            $scope.event = item;
        });

        

        
    }];
})(Simple, Simple.Inspector);