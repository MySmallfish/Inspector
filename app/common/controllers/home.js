(function (S, I) {
    I.HomeController = [
        "$scope",
        "$location",
        "loginManager",
        "scanner",
        "timeReportManager", function ($scope, $location, loginManager, scanner, timeReportManager) {


            function onTimeReportError(error, info) {
                var errors = ["EmployeeMissing", "SiteMissing", "LocationNotFound"];

                var reportError = errors.indexOf(error);

                if (reportError>=0) {
                    $scope.reportError = error.error;
                } else {
                    $scope.reportError = "UnexpectedError";
                }

                console.log("error", error, $scope.reportError, reportError);
            }

            function onTimeReported(info) {
                if (info && info.success) {
                    $location.path("/ApproveReport").search({ reportId: info.reportId });
                } else {
                    onTimeReportError(null, info);
                }
            }

            function onBarcodeScanned(barCode, context) {

                $scope.barCode = barCode;
                if (barCode && barCode.length > 0) {
                    $scope.notifyProgressStarted().then(function () {
                        return timeReportManager.reportByCode(barCode, context == "Enter").then(onTimeReported, onTimeReportError);
                    }).finally($scope.notifyProgressCompleted);
                }
            }

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

            function navigateToReports() {
                $location.path("/TimeReports");
            }

            function navigateToManualReport() {
                $location.path("/ManualReport");
            }

            function navigateToManagerReport() {
                $location.path("/ManagerReport");
            }

            function sendFailedReports() {
                timeReportManager.send();
                
            }

            _.extend($scope, {
                scanEnter: scanEnter,
                scanExit: scanExit,
                managerReportEnabled: false,
                navigateToManualReport: navigateToManualReport,
                navigateToManagerReport: navigateToManagerReport,
                navigateToReports: navigateToReports,
                scanSupported: scanner.isScannerSupported(),
                sendFailedReports: sendFailedReports
            });

            function checkUnsentReports() {
                timeReportManager.hasUnsentReports().then(function (result) {
                    $scope.hasUnsentReports = result;
                });
            }

            $scope.$on("Inspector.ReportsSendCompleted", checkUnsentReports);

            $scope.$on("Simple.BarcodeScanned",
                function (e, barCode, context) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            onBarcodeScanned(barCode, context);
                        });
                    } else {
                        onBarcodeScanned(barCode, context);
                    }
                });

            $scope.changeHeader({
                header: "Inspector",
                refresh: true,
                logout: true
            });

            $scope.isManagerPermissions = true;
            $scope.isReportPermissions = true;

            function setPermissions(employeeInfo) {
                if (typeof employeeInfo.EmployeeId !== "number" || employeeInfo.EmployeeId <= 0 || !employeeInfo.AllowAppLogin) {

                    $scope.isManagerPermissions = true;
                    $scope.isReportPermissions = false;
                } else {
                    $scope.isManagerPermissions = false;
                    $scope.isReportPermissions = true;
                }
            }

            function loadUser() {
                loginManager.isUserLoggedIn().then(function (user) {
                    setPermissions(user.user);
                }, function () {
                    location.href = "#/Login";
                });
            }

            function getReports() {
                return timeReportManager.getTimeReports().then(function(items) {
                    $scope.reports = items;
                });

            }

            function prepare() {
                _.defer(function () {
                    timeReportManager.clearPending();
                    timeReportManager.deleteOldReports();
                });
            }
            
            prepare();

            $scope.notifyProgressStarted()
                    .then(loadUser)
                    .then(checkUnsentReports)
                    .then(getReports)
                    .finally($scope.notifyProgressCompleted);

        }
    ];
})(Simple, Simple.Inspector);