(function(S){
	S.TimeReportsController = function($scope, scanner, timeReportManager) {
	    $scope.reports = timeReportManager.getTimeReports();
	   // [
	   //     {
	   //         Date: new Date(),
	   //         IsEnter: true,
	   //         Site: {
	   //             Id: 1,
	   //             Name: "כניסה ראשים"
	   //         },
	   //         Location: {
	   //             Longitude: 32.43553,
	   //             Latitude: 45.43332
	   //         }
	   //     },
	   //     {
	   //         Date: new Date(),
	   //         IsEnter: false,
	   //         Site: {
	   //             Id: 1,
	   //             Name: "כניסה ראשים"
	   //         },
	   //         Location: {
	   //             Longitude: 32.43553,
	   //             Latitude: 45.43332
	   //         }
	   //     },
	   //     {
	   //         Date: new Date(),
	   //         IsEnter: true,
	   //         Site: {
	   //             Id: 1,
	   //             Name: "כניסה ראשים"
	   //         },
	   //         Location: {
	   //             Longitude: 32.43553,
	   //             Latitude: 45.43332
	   //         }
	   //     }];

	}
})(Simple);