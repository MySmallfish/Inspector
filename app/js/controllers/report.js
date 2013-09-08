(function(S) {
    S.ReportController = function($scope, $location, $window, timeReportManager) {
        var uniqueId = $location.search().reportId;
        $scope.timeReport = timeReportManager.get(uniqueId);
        //{
        //    Date: new Date(),
        //    IsEnter: true,
        //    Site: {
        //        Id: 1,
        //        Name: "כניסה ראשים"
        //    },
        //    Location: {
        //        Longitude: 32.43553,
        //        Latitude: 45.43332
        //    }
        //};

        $scope.approve = function() {
            timeReportManager.approve(uniqueId).then(function() {
                $location.path("TimeReports");
            }); // ERROR??
        };

        $scope.repair = function() {
            $window.history.back();
        };
    };
})(Simple);