(function(S) {
    S.ScanReportController = function($scope, $location, scanner, timeReportManager,$route) {
        function onTimeReported(info) {
            console.log("REPORT!", info);
            if (info.success) {
                $location.path("/ApproveReport").search({ reportId: info.reportId });
            } else {
                console.log("ERROR!");
            }
        }

        function onBarcodeScanned(barCode) {
            
            $scope.barCode = barCode;
            if (barCode && barCode.length > 0) {
                timeReportManager.reportByCode(barCode).then(onTimeReported, function (e) {
                    console.log("ERRRRRR", e);
                });
            } else {
                $route.reload();
            }
        }

        $scope.$on("Simple.BarcodeScanned",
            function(e, barCode) {
                if (!$scope.$$phase) {
                    $scope.$apply(function() {
                        onBarcodeScanned(barCode);
                    });
                } else {
                    onBarcodeScanned(barCode);
                }
            });

        $scope.scanSupported = scanner.isScannerSupported();
        if ($scope.scanSupported) {
            scanner.scan();
        }

        $scope.simulateScan = function () {
            scanner.simulate($scope.barCode);
        };
        
    };
})(Simple);