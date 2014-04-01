(function (S, I) {
    I.RegisterPhoneNumberController = [
        "$scope",
        "$location",
        "loginManager", function ($scope, $location, loginManager) {
            $scope.changeHeader("RegisterPhoneTitle");
            function register() {
                var number = $scope.phoneNumber;
                $scope.notifyProgressStarted().then(function() {
                    return loginManager.registerPhoneNumber(number).then(function(code) {
                        $scope.registrationCode = code.replace(/"/gi, '');

                    });
                }).finally($scope.notifyProgressCompleted);
            }
            function navigate(context) {
                $location.path("/");
                return context;
            }
            function approve() {
                return loginManager.setUserPhoneNumber($scope.phoneNumber).then(navigate);
            }

            _.extend($scope, {
                register: register,
                approve: approve
            })
        }
    ];

})(Simple, Simple.Inspector);