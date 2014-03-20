(function(S, I) {
    I.LoginController = function($scope, loginManager) {

        $scope.changeHeader("Login");

        function navigate() {
            location.href = "#/";
        }

        loginManager.isUserLoggedIn().then(function() {
            navigate();
        });

        $scope.login = function() {
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);

            function loginUser(userInfo) {
                loginManager.login({
                    user: userInfo,
                    loggedInAt: moment().format("YYYY-MM-DD HH:mm")
                }).then(navigate);
            }

            function authenticationFailed() {
                $scope.loginError = "AuthenticationFailed";
            }

            authResult.then(loginUser, authenticationFailed);

        };
    };
})(Simple, Simple.Inspector);