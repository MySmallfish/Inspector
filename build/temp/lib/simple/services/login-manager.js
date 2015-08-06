(function(S) {
    S.LoginManager = ["storageService", "$q", "azureActiveDirectory", function (storageService, $q, azureActiveDirectory) {

        function refreshAuthentication() {
            return sessionInfo().then(function (user) {
                var promise = $q.defer();
                if (user) {
                    azureActiveDirectory.refreshAuthentication(user.token.refresh_token).then(function(auth) {
                        user.token = auth.data;
                        return login(user);
                    }).then(promise.resolve, promise.reject);
                } else {
                    promise.reject();
                }
                return promise.promise;
            });

        }

        function authenticate(userName, password) {
            
            return azureActiveDirectory.authenticate(userName, password).then(function(auth) {
                return auth;
            });
        }
        
        function sessionInfo(value){
            return storageService.prefix("SimplyLog").session("User", value);
        }
        function storeLastUser(user) {
            localStorage.setItem("LastUserName", user.user.Username.replace("@simplylog.co.il", ""));
            return user;
            //return storageService.prefix("SimplyLog").local("LastUserName", user.Username).then(function() {
            //    return user;
            //});
        }

        function getLastUser() {
            var lastUser = localStorage.getItem("LastUserName");
            return $q.when(lastUser);
            //return storageService.prefix("SimplyLog").local("LastUserName");
        }

        var currentUser;
        function login(user) {
            if (/_/.test(user.user.Username)) {
                user.user.Username = user.user.Username.replace("_", "@");
            }

            var result = sessionInfo(user).then(function () {
                currentUser = user;
                
                return storeLastUser(user);
            });
           
           return result;
        }
        
        function isValidToken(user) {
            var isValid = moment().unix() <= (parseInt(user.token.expires_on, 10) -120);
            return isValid;
        }

        function logout() {
            currentUser = null;
            return sessionInfo(null);
        }

        function isUserLoggedIn(){
            var result = $q.defer();
            var userPromise;
            if (currentUser) {
                userPromise =$q.when(currentUser);
            } else {
                userPromise = sessionInfo();
            }

            userPromise.then(function(info) {
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
            return sessionInfo().then(function(user) {
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
            refreshAuthentication: refreshAuthentication,
            getLastUser: getLastUser
        };
    }];
})(Simple);