(function(S, I) {
    I.HomeController = [
        "$scope",
        "$location",
        "loginManager",
        "scanner",
        "timeReportManager", function ($scope, $location, loginManager, scanner, timeReportManager) {


            function onTimeReportError(error, info) {
                console.error(error, info);
            }

            function onTimeReported(info) {
                if (info.success) {
                    $location.path("/ApproveReport").search({ reportId: info.reportId });
                } else {
                    onTimeReportError(null, info);
                }
            }

            function onBarcodeScanned(barCode, context) {
                
                $scope.barCode = barCode;
                if (barCode && barCode.length > 0) {
                    timeReportManager.reportByCode(barCode, context == "Enter").then(onTimeReported, function(e) {
                        onTimeReportError(e, null);
                    });
                }
            }

            $scope.$on("Simple.BarcodeScanned",
                function(e, barCode, context) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function() {
                            onBarcodeScanned(barCode, context);
                        });
                    } else {
                        onBarcodeScanned(barCode, context);
                    }
                });
            
            

            function scanEnter() {
                if (scanner.isScannerSupported()) {
                    scanner.scan("Enter");
                } else {
                    onBarcodeScanned($scope.barCode, "Enter");
                }
            }

            function scanExit() {
                if (scanner.isScannerSupported()) {
                    scanner.scan("Exit");
                } else {
                    onBarcodeScanned($scope.barCode, "Exit");
                }
            }

            
            _.extend($scope, {
                scanEnter: scanEnter,
                scanExit: scanExit,
                managerReportEnabled: false,
                scanSupported: scanner.isScannerSupported()
            });

            loginManager.isUserLoggedIn().then(function (user) {
                user = user || { managerReportEnabled: true };
                $scope.managerReportEnabled = user.managerReportEnabled;
            }, function () {
                location.href = "#/Login";
            });


        }
    ];
})(Simple, Simple.Inspector);