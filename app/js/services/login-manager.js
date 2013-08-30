(function(S){
	S.LoginManager = function(storageService, $q){
		var userLoggedIn = false;
		function isLoggedIn(){
			return userLoggedIn;
		}
		
		function login(userName, password){
		    userLoggedIn = true;
		    var result = $q.defer();
		    var token = "ABC123";
		    result.resolve(token);
		    return result.promise;
		}
		
		return {
			isUserLoggedIn: isLoggedIn,
			login: login
		}
	}
})(Simple);