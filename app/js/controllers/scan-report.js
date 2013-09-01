(function(S) {
    S.ScanReportController = function($scope, $location, scanner, timeReportManager) {
        function onTimeReported(info) {
            if (info.success) {
                $location.path("/ApproveReport").search({ reportId: info.reportId });
            }
        }

        function onBarcodeScanned(barCode) {
            alert("BC" + barCode);
            timeReportManager.reportByCode(barCode).then(onTimeReported);
        }

        $scope.$on("Simple.BarcodeScanned", onBarcodeScanned);

        scanner.scan();
        $scope.simulateScan = function () {
            scanner.simulate($scope.barCode);
        };
        
    };
})(Simple);