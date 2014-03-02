(function(S, I){
    I.TimeReportsController = ["$scope", "scanner", "timeReportManager", function($scope, scanner, timeReportManager) {
        timeReportManager.getTimeReports().then(
            function(reports) {
                $scope.reports = reports;
            });
        
	}];
})(Simple, Simple.Inspector);