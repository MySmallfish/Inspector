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

            function loginUser(token) {
                loginManager.login($scope.Username, token).then(navigate);
            }

            function authenticationFailed() {
                $scope.loginError = "AuthenticationFailed";
            }

            authResult.then(loginUser, authenticationFailed);

        };
    };
})(Simple, Simple.Inspector);