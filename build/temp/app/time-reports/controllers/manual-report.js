(function (S, I) {
    I.ManualReportController = ["$scope", "$location", "timeReportManager", "loginManager", "siteService", "configuration", function ($scope, $location, timeReportManager, loginManager, siteService, configuration) {
        loginManager.getCurrentUser().then(function (user) {
            $scope.siteId = user.SiteId;
            if ($scope.siteId) {
                siteService.getById(user.SiteId).then(loadSite);
            }
        });

        function loadSite(site) {
            $scope.siteName = site.Name;
        }
        function onTimeReportError(error, info) {
            console.error(error, info);
        }

        function onTimeReported(info) {
            if (info.success) {
                if (configuration.autoCommitReport) {
                    timeReportManager.approve(info.reportId);
                    $location.path("/").search({ displaySuccess: true });
                } else {

                    $location.path("/ApproveReport").search({ reportId: info.reportId });
                }
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
            $scope.reportApproved = false;
            var siteId = String($scope.number);
            if ($scope.siteId) {
                siteId = $scope.siteId;
            }
            timeReportManager.reportByCode(siteId, context == "Enter").then(onTimeReported, function (e) {
                onTimeReportError(e, null);
            });
        }

        $scope.changeHeader({
            header: "EnterSiteCode",
            back: true
        });

        _.extend($scope, {
            enter: enter,
            exit: exit,
            maxSiteCodeLength: 5
        });
    }];
})(Simple, Simple.Inspector);