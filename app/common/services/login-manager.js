(function (S) {
    S.LoginManager = ["storageService", "$q", "inspectorApi", function (storageService, $q, inspectorApi) {


        function authenticate(userName, password) {
                return inspectorApi.signIn(userName, password).then(function (item) {
                    
                    return item;
                });

            }

            function sessionInfo(value) {
                return storageService.prefix("SimplyLog").session("User", value);
            }

            var currentUser;
            function login(user) {
                var result = sessionInfo(user).then(function () {
                    currentUser = user;
                });

                return result;
            }

            function isValidToken(user) {
                return true;
                var isValid = moment().unix() <= (parseInt(user.token.expires_on, 10) + 300);
                return isValid;
            }

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
                authenticate: authenticate
            };
        }];
})(Simple);