(function(S, SL) {
    SL.LoginController = function ($q, $scope, loginManager, queueManager, network, networkManager, $log, textResource) {
        $scope.changeHeader(textResource.get("SystemLogin"));
        //$scope.Username = "mysmallfish@gmail.com";
        //$scope.Password = "1234";
        $scope.Username = "yairc";
        $scope.Password = "Y123456!";


        function navigate() {
            location.href = "#/";
        }

        
        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.networkStatus = "Unknown";
        function updateNetworkStatus() {
            $scope.networkStatus = network.isOnline() ? "Online" : "Offline";
        }
        $scope.$on("Simple.NetworkStatusChanged", function (args) {
            updateNetworkStatus();
        });


        updateNetworkStatus();
        $scope.login = function () {
            $scope.$emit("progress-started");
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);
            function loginUser(user) {
                loginManager.login(user).then(navigate);
            }

            function authenticationFailed(error) {
                $scope.loginError = "AuthenticationFailed";
            }

            authResult.then(loginUser, authenticationFailed).finally(function () {
                $scope.$emit("progress-completed");
            });

        };
    };
})(Simple, SimplyLog);