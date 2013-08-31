(function(S){
	S.TimeReportManager = function($q, storageService){
		
		function reportTime(reportInfo){
		    var d = $q.defer();
		    d.resolve({ success: true, reportId: 1 });
		    return d.promise;		    
		}
		
		function reportByCode(barCode){
            return reportTime({});
		}
		
		return {
		  reportByCode: reportTime,
		  report: reportTime
		};
	}
	
})(Simple);