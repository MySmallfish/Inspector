(function(S, I){
    I.TimeReportsController = ["$scope", "scanner", "timeReportManager", function($scope, scanner, timeReportManager) {

        $scope.changeHeader({
            header: "TimeReports",
            home: true
        });

        $scope.$on("Inspector.ReportsSendCompleted", load);

        function load() {
            timeReportManager.getTimeReports().then(
                function (reports) {
                    $scope.reports = reports;
                });
        }

        load();

    }];
})(Simple, Simple.Inspector);