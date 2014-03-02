(function(S) {

    S.AppController = function($scope, $window, $location) {
        $scope.title = "";
        $scope.hasBack = true;
        var map =
        {
            '/': { title: "Inspector" },
            '/Login': { title: "כניסה למערכת" },
            '/ScanReport': { title: "סריקת ברקוד לדיווח", hasBack: true },
            '/ManualReport': { title: "דיווח ידני", hasBack: true },
            '/ManagerScanReport': { title: "סריקת מנהל", hasBack: true },
            '/TimeReports': { title: "דיווחים", hasBack: false, hasHome: true },
            '/Setup': { title: "הגדרת אתר", hasBack: true },
            '/Settings': { title: "הגדרות מערכת", hasBack: true },
            '/ApproveReport': { title: "אישור דיווח", hasBack: true }
        };

        $scope.goBack = function() {
            $window.history.back();
        };
        $scope.goHome = function() {
            $location.path("/");
        };
        $scope.$on("$routeChangeSuccess", function(angularEvent, current, previous) {
            var options = map[current.$$route.originalPath] || { title: "", hasBack: false };

            $scope.setTitle(options.title, options.hasBack, options.hasHome);

        });

        $scope.setTitle = function(title, hasBack, hasHome) {
            $scope.title = title;
            $scope.hasBack = hasBack;
            $scope.hasHome = hasHome;

        };
    };

})(Simple);