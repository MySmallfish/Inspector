(function (S, I) {
    I.EventTimeReportsController = ["$scope", "eventReportManager", "employeeService", function ($scope, eventReportManager, employeeService) {

        eventReportManager.getEventById(11).then(function (item) {
            $scope.event = item;
        });

        

        
    }];
})(Simple, Simple.Inspector);