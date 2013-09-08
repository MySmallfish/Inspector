(function(S) {
    S.LoginManager = function(storageService, $q) {
        var userLoggedIn = false;

        function authenticate(userName, password){
            var result = $q.defer();
            var token = { token: "ABC123", expiredAt: new Date() };
            if (userName  == "1"){
                result.resolve(token);
            } else {
                result.reject();
            }
            return result.promise;
        }
        
        function sessionInfo(value){
            return storageService.prefix("Inspector").session("SessionInfo", value);
        }
        function login(userName, token) {
            var result = sessionInfo({ token: token, userName: userName }).then(function () {
                 userLoggedIn = true;
            });
           
           return result;
        }
        
        function isValidToken(token){
            var now = new Date();
            return now < moment(token.expiredAt).add("d", 5);
        }
        function isUserLoggedIn(){
            var result = $q.defer();
            if (!userLoggedIn){
                var userInfo = sessionInfo().then(function(info){
                    if (info && info.token){
                        
                        if (isValidToken(info.token)){
                            result.resolve();
                        } else {
                            result.reject();
                        }
                    } else {
                        result.reject();
                    }
                });
            } else {
                result.resolve();
            }
            return result.promise;
        }

        
        return {
            isUserLoggedIn: isUserLoggedIn,
            login: login,
            authenticate: authenticate
        };
    };
})(Simple);