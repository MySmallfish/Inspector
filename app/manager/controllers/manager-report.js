(function (S, I) {
    I.ManagerReportController = ["$scope", "timeReportManager", function ($scope, timeReportManager) {
        $scope.changeHeader({
            header: "ManagerReport",
            back: true
        });

        $scope.managerScanEnter = function () {
            $scope.status = "enter";
            console.log("scanEnter");
        };
        
        $scope.managerScanExit = function () {
            $scope.status = "exit";
            console.log("scanExit");
        };

        timeReportManager.getEvents().then(function (items) {
            $scope.events = items;
        });
    }];
})(Simple, Simple.Inspector);