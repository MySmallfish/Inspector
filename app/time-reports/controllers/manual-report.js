(function(S, I) {
    I.ManualReportController = ["$scope", "$location", "timeReportManager", "loginManager", "siteService", function ($scope, $location, timeReportManager, loginManager, siteService) {
        loginManager.getCurrentUser().then(function(user) {
            $scope.siteId = user.SiteId;
            siteService.getById(user.SiteId).then(loadSite);
        });

        function loadSite(site) {
            $scope.siteName = site.Name;
        }
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
            var siteId = String($scope.number);
            if ($scope.siteId) {
                siteId = $scope.siteId;
            }
            console.log("SITEid", siteId);
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