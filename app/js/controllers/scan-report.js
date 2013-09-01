(function(S) {
    S.ScanReportController = function($scope, $location, scanner, timeReportManager,$route) {
        function onTimeReported(info) {
            if (info.success) {
                $location.path("/ApproveReport").search({ reportId: info.reportId });
            }
        }

        function onBarcodeScanned(e, barCode) {
            $scope.barCode = barCode;
            if (barCode && barCode.length > 0) {
                timeReportManager.reportByCode(barCode).then(onTimeReported);
            } else {
                $route.reload();
            }
        }

        $scope.$on("Simple.BarcodeScanned", onBarcodeScanned);

        scanner.scan();
        
        $scope.simulateScan = function () {
            scanner.simulate($scope.barCode);
        };
        
    };
})(Simple);