(function(S) {
    S.TimeReportManager = function($q, storageService) {

        function reportTime(reportInfo) {
            console.log("R", reportInfo);
            var d = $q.defer();
            d.resolve({ success: true, reportId: reportInfo.barCode || "UNK" });
            return d.promise;
        }

        function reportByCode(barCode) {
            return reportTime({ barCode: barCode });
        }

        return {
            reportByCode: reportByCode,
            report: reportTime
        };
    };

})(Simple);