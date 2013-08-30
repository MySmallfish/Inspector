(function(S){
	S.LoginController = function($scope, loginManager){
		$scope.login = function(){
			
			loginManager.login($scope.Username, $scope.Password).then(function(){
			   location.href= "#/";
			});
		}
	}
})(Simple);