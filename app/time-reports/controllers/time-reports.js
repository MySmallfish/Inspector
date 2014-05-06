(function(S, I){
    I.TimeReportsController = ["$scope", "scanner", "timeReportManager", "configuration", function($scope, scanner, timeReportManager, configuration) {

        $scope.changeHeader({
            header: "TimeReports",
            home: true
        });


        $scope.$on("Inspector.ReportsSendCompleted", load);

        function load() {
            timeReportManager.getTimeReports().then(
                function (reports) {
                    if (!configuration.displaySuccessfulReports) {
                        reports = _.filter(reports, function(item) {
                            return item.Status != I.SendStatus.Sent;
                        });
                    }
                    $scope.reports = reports;
                });
        }

        load();

    }];
})(Simple, Simple.Inspector);