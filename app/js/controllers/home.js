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
	            text: "הגדרות"
	        },	        
	        {
	            command: "Login",
	            text: "יציאה",
	            isDanger: true
	        }
	        


        ];
	    
		if (!loginManager.isUserLoggedIn()){
			location.href = "#/Login";
		}
		
		$scope.run = function(command){
		    location.href = "#/" + command;
		}
	}
})(Simple);