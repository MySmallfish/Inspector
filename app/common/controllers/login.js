(function(S, I) {
    I.LoginController = function($scope, loginManager) {

        $scope.changeHeader("Login");

        function navigateHome() {
            location.href = "#/";
        }

        function navigate(user) {
            if (user.user.EmployeeId && user.user.EmployeeId > 0) {
                loginManager.getRegisteredPhoneNumber().then(function(phoneNumber) {
                    if (!phoneNumber) {
                        location.href = "#/RegisterPhoneNumber";
                    } else {
                        console.log("user.user.PhoneNumber != phoneNumber.number", user.user.PhoneNumber, phoneNumber.number);
                        if (user.user.PhoneNumber != phoneNumber.number) {

                            loginManager.logout().then(function() {
                                $scope.loginError = "InvalidPhoneNumber";
                                
                            });
                        } else {
                            navigateHome();
                        }
                    }
                });
            } else {
                navigateHome();
            }
        }

        loginManager.isUserLoggedIn().then(navigate);

        $scope.login = function() {
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);

            function loginUser(userInfo) {
                return loginManager.login({
                    user: userInfo,
                    loggedInAt: moment().format("YYYY-MM-DD HH:mm")
                }).then(navigate);
            }

            function authenticationFailed() {
                $scope.loginError = "AuthenticationFailed";
            }

            $scope.notifyProgressStarted().then(function() {
                return authResult.then(loginUser, authenticationFailed);
            }).finally($scope.notifyProgressCompleted);


        };
    };
})(Simple, Simple.Inspector);