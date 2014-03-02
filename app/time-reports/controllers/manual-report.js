(function(S, I) {
    I.ManualReportController = ["$scope", "$location", "timeReportManager", function ($scope, $location, timeReportManager) {
        function onTimeReportError(error, info) {
            console.error(error, info);
        }

        function onTimeReported(info) {
            if (info.success) {
                $location.path("/ApproveReport").search({ reportId: info.reportId });
            } else {
                onTimeReportError(null, info);
            }
        }

        function enter() {
            return report("Enter");
        }

        function exit() {
            return report("Exit");
        }
        function report(context) {
            timeReportManager.reportByCode(String($scope.number), context == "Enter").then(onTimeReported, function (e) {
                onTimeReportError(e, null);
            });
        }

        $scope.changeHeader({
            header: "ManualReport",
            back: true
        });

        _.extend($scope, {
            enter: enter,
            exit: exit,
            maxSiteCodeLength: 5
        });
    }];
})(Simple, Simple.Inspector);