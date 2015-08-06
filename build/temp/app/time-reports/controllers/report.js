(function(S, I) {
    I.ReportController = ["$scope", "$location", "$window", "$routeParams", "timeReportManager", function($scope, $location, $window,$routeParams, timeReportManager) {
        var uniqueId = $routeParams.reportId;

        if (uniqueId) {
            $scope.changeHeader("ApproveReport");
        } 
        timeReportManager.get(uniqueId).then(function (timeReport) {
            
            $scope.timeReport = timeReport;
        });

        $scope.approve = function() {
            timeReportManager.approve(uniqueId).then(function (item) {
                
                $location.path("TimeReports");
            }); 
        };

        $scope.repair = function () {
            timeReportManager.discard(uniqueId);
            $window.history.back();
        };
    }];
})(Simple, Simple.Inspector);