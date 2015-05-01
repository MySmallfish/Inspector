(function(S, SL) {
    SL.LoginController = ["$q", "$scope","loginManager", "queueManager", "network", "networkManager", "$log", "textResource", function ($q, $scope, loginManager, queueManager, network, networkManager, $log, textResource) {
        $scope.changeHeader(textResource.get("SystemLogin"));

        function navigate() {
            location.href = "#/";
        }

        function setLastUser() {
            loginManager.getLastUser().then(function(userName) {
                $scope.Username = userName;
            });
        }

        function tryRefreshAuthentication() {
            $scope.notifyProgressStarted()
                .then(loginManager.refreshAuthentication)
                .then(navigate, setLastUser)
                .finally($scope.notifyProgressCompleted);
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        }, tryRefreshAuthentication);


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
    }];
})(Simple, SimplyLog);