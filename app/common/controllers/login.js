(function(S, I) {
    I.LoginController = function($scope, loginManager) {

        $scope.changeHeader("Login");

        function navigate() {
            loginManager.getRegisteredPhoneNumber().then(function (phoneNumber) {
                if (!phoneNumber /*|| user.user.PhoneNumber != phoneNumber.number*/) {
                    location.href = "#/RegisterPhoneNumber";
                } else {
                    location.href = "#/";
                }
            });
            
            
        }

        loginManager.isUserLoggedIn().then(function (user) {

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