(function(S, I) {
    I.LoginController = [
        "$scope",
        "loginManager",
        "storageService",
        "$log",
        function ($scope, loginManager, storageService, $log) {

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

        
        loginManager.isUserLoggedIn().then(navigate, loadLastUser);

        function loadLastUser() {
            storageService.prefix("Inspector").local("LastUserName").then(function(userName) {
                $scope.Username = userName;

            });
        }

        function storeLastUser(context) {
            storageService.prefix("Inspector").local("LastUserName", $scope.Username);
            return context;
        }

        $scope.login = function() {
            var authResult = loginManager.authenticate($scope.Username, $scope.Password);

            function loginUser(userInfo) {
                
                return loginManager.login({
                    user: userInfo,
                    loggedInAt: moment().format("YYYY-MM-DD HH:mm")
                }).then(storeLastUser).then(navigate);
            }

            function authenticationFailed(e) {
                $log.error("Authentication failed", e);
                $scope.loginError = "AuthenticationFailed";
            }

            $scope.notifyProgressStarted().then(function() {
                return authResult.then(loginUser, authenticationFailed);
            }).finally($scope.notifyProgressCompleted);


        };
    }];
})(Simple, Simple.Inspector);