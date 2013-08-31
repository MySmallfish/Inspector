(function(S){
	S.ReportController = function($scope,$location,$window){
	   console.log($location.search().reportId);
	   $scope.timeReport = {
	       Date: new Date(),
	       Time: new Date(),
	       Site: {
	           Id: 1,
	           Name: "כניסה ראשים"
	       },
	       Location: {
	           Longitude: 32.43553,
	           Latitude: 45.43332
	       }
	   };
	   
	   $scope.approve = function(){
	       $location.path("TimeReports");
	   }
	   
	   $scope.repair = function(){
	      $window.history.back();
	   }
	}
})(Simple);