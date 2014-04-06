(function (S) {
    S.LoginManager = ["storageService", "$q", "inspectorApi", "network", function (storageService, $q, inspectorApi, network) {

        function authenticate(userName, password) {
            return inspectorApi.signIn(userName, password).then(function (item) {

                return item;
            });

        }

        function getRegisteredPhoneNumber() {
            return sessionInfo().then(function (user) {
                return storageService.prefix("Inspector").local("UserPhoneNumber" /*+ user.user.UserId*/);
            });
        }

        function setUserPhoneNumber(phoneNumber) {
            return sessionInfo().then(function (user) {
                return storageService.prefix("Inspector").local("UserPhoneNumber" /*+ user.user.UserId */, { number: phoneNumber });
            });
        }

        function registerPhoneNumber(phoneNumber) {
            return sessionInfo().then(function(user) {
                return inspectorApi.registerPhoneNumber(user.user.UserId, user.user.EmployeeId, phoneNumber);
            });
        }

        function sessionInfo(value) {
            return storageService.prefix("Inspector").local("User", value);
        }

        var currentUser;

        function login(user) {
            var result = sessionInfo(user).then(function () {
                currentUser = user;
                return user;
            });

            return result;
        }

        function isValidToken(user) {
            return moment().subtract('days', 7).unix() <= moment(user.loggedInAt).unix();
        }

        // alertService.show({ title: response.Title, message: response.Text, templateUrl: "app/common/views/alert.html" });
        function logout() {
            currentUser = null;
            return sessionInfo(null);
        }

        function isUserLoggedIn() {
            var result = $q.defer();
            var userPromise;
            if (currentUser) {
                userPromise = $q.when(currentUser);
            } else {
                userPromise = sessionInfo();
            }

            userPromise.then(function (info) {
                if (info) {
                    if (isValidToken(info)) {
                        currentUser = info;
                        result.resolve(info);
                    } else {
                        result.reject();
                    }
                } else {
                    result.reject();
                }
            });

            return result.promise;
        }

        function getCurrentUser() {
            return sessionInfo().then(function (user) {
                return user.user;
            });
        }

        function getAccessToken() {
            return isUserLoggedIn().then(function (info) {
                return info.token.access_token;
            }, logout);
        }

        return {
            getAccessToken: getAccessToken,
            isUserLoggedIn: isUserLoggedIn,
            getCurrentUser: getCurrentUser,
            login: login,
            logout: logout,
            authenticate: authenticate,
            registerPhoneNumber: registerPhoneNumber,
            setUserPhoneNumber: setUserPhoneNumber,
            getRegisteredPhoneNumber: getRegisteredPhoneNumber
        };
    }];
})(Simple);