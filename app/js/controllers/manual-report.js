(function(S) {
    S.ManualReportController = function($scope,$location) {
        $scope.actions = [{
                text: "כניסה",
                isSuccess: true,
                command: "Enter"
            }, {
                text: "יציאה",
                isDanger: true,
                command: "Exit"
            }];

        $scope.run = function (command) {
            $location.path("/ApproveReport").search({ reportId: 2 });
        };
    };
})(Simple);