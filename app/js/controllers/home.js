(function(S){
	S.HomeController = function($scope, loginManager){
	    $scope.actions = [
	        {
	            command: "ScanReport",
	            text: "סריקה",
	            isPrimary: true
	        },
	        {
	            command: "ManualReport",
	            text: "דיווח ידני"
	        },
	        {
	            command: "ManagerScanReport",
	            text: "סריקת מנהל"
	        },
	        {
	            command: "TimeReports",
	            text: "דיווחים"
	        },
	        {
	            command: "Setup",
	            text: "הגדרת אתר"
	        },
{
	            command: "Settings",
	            text: "הגדרות",
	            half: true
	        },	        
	        {
	            command: "Login",
	            text: "יציאה",
	            half: true
	        }
	        


        ];
	    
			
	    loginManager.isUserLoggedIn().then(function(){
	        
	    }, function(){
	        location.href = "#/Login";
	    });
		$scope.run = function(command){
		    location.href = "#/" + command;
		}
	}
})(Simple);