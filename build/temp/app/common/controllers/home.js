(function (S, I) {
    I.HomeController = [
        "$scope",
        "$location",
        "loginManager",
        "scanner",
        "timeReportManager",
        "configuration",
        "$routeParams",
        "siteService",
        "$timeout",
        "$q",
        "flashlight",
        "simplylogClient",
        "safeApply",
        function ($scope, $location, loginManager, scanner, timeReportManager, configuration, $routeParams, siteService, $timeout, $q, flashlight, simplylogClient, safeApply) {
            
            $scope.changeHeader({
                header: "Inspector",
                refresh: true,
                logout: true
            });


            $scope.hasManagerPermissions = false;
            $scope.hasBarcodePermissions = false;
            $scope.hasManualPermissions = false;
            $scope.flashSupported = false;

            flashlight.isAvailable().then(function() {
                $scope.flashSupported = true;
            });

            prepare();

            $scope.notifyProgressStarted()
                    .then(loadUser)
                    .then(checkUnsentReports)
                    .then(sendUnsentReports)
                    .finally($scope.notifyProgressCompleted);

            

            function sendUnsentReports() {
                if ($scope.hasUnsentReports) {
                    return timeReportManager.send();
                } else {
                    return $q.when({});
                }
            }

            function loadSite(site) {
                $scope.siteName = site.Name;
            }

            function fetchSite(siteId) {
                console.log("fetch site", siteId);
                return siteService.getById(parseInt(siteId, 10));
            }

            function loadUser() {
                loginManager.isUserLoggedIn().then(function (user) {
                    setPermissions(user.user);
                    $scope.siteId = user.user.SiteId;
                    if ($scope.siteId) {
                        fetchSite($scope.siteId).then(loadSite);
                    }
                }, function () {
                    location.href = "#/Login";
                });
            }

            if ($routeParams.displaySuccess) {
                setReportApproved();
            }
            function setReportApproved() {
                $scope.reportApproved = true;
                $timeout(function() {
                    $scope.reportApproved = false;
                }, 10000);
            }
            function onTimeReportError(error, info) {
                var errors = ["EmployeeMissing", "SiteMissing", "LocationNotFound"];

                var reportError = errors.indexOf(error.error);
                if (reportError>=0) {
                    $scope.reportError = error.error;
                } else {
                    $scope.reportError = "UnexpectedError";
                }
            }

            function onTimeReported(info) {
                if (info && info.success) {
                    if (configuration.autoCommitReport) {
                        timeReportManager.approve(info.reportId);
                        setReportApproved();
                    } else {
                        $location.path("/ApproveReport").search({ reportId: info.reportId });
                    }
                } else {
                    onTimeReportError(null, info);
                }
            }

            function onBarcodeScanned(barCode, context) {

                $scope.barCode = barCode;
                if (context != "Patrol") {
                    if (barCode && barCode.length > 0) {
                        $scope.notifyProgressStarted().then(function() {
                            return timeReportManager.reportByCode(barCode, context == "Enter").then(onTimeReported, onTimeReportError);
                        }).finally($scope.notifyProgressCompleted);
                    }
                }
            }

            function startReporting() {
                $scope.reportingIncident = true;
            }

            function cancelIncidentReporting() {
                $scope.reportingIncident = false;
            }
            function reportIncident(description) {
                // show popup to get description...

                $scope.sendingIncidentReport = true;
                return loginManager.getCurrentUser().then(function(user) {
                    return simplylogClient.reportIncident(user.SimplyLogTenant, {
                        TemplateId: description ? user.IncidentTemplate : user.EmergencyIncidentTemplate,
                        Description: description
                    });
                }).finally(function () {
                    if (description) {
                        $scope.reportingIncident = false;
                    }
                    $scope.sendingIncidentReport = false;
                });
            }

            function toggleFlash() {
                flashlight.toggle();
            }
            function approvePatrolScan() {
                $scope.patrolSite = null;

            }
            function patrolScan() {
                if (scanner.isScannerSupported()) {
                    scanner.scan("Patrol").then(function(result) {
                        return result.barcode;
                    }).then(fetchSite, function(error) {
                        $scope.patrolSiteError = "PatrolBarcodeNotScanned";
                    }).then(function (site) {
                        $scope.patrolSite = site;
                        safeApply($scope);
                    }, function(error) {
                        $scope.patrolSiteError = "PatrolSiteNotFound";
                    }).finally(flashlight.switchOff);
                } else {
                    fetchSite("10239").then(function (site) {
                        $scope.patrolSite = site;
                    }).finally(flashlight.switchOff);
                }
            }

            function enterManual() {
                onBarcodeScanned(String($scope.siteId), "Enter");
            }

            function exitManual() {
                onBarcodeScanned(String($scope.siteId), "Exit");
            }

            function scanEnter() {
                $scope.reportApproved = false;
                if (scanner.isScannerSupported()) {
                    scanner.scan("Enter");
                } else {
                    onBarcodeScanned($scope.barCode, "Enter");
                }
            }

            function scanExit() {
                $scope.reportApproved = false;
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

            function takePicture() {
                
            }

            _.extend($scope, {
                takePicture: takePicture,
                cancelIncidentReporting: cancelIncidentReporting,
                startReporting: startReporting,
                toggleFlash: toggleFlash,
                approvePatrolScan:approvePatrolScan,
                patrolScan: patrolScan,
                reportIncident: reportIncident,
                scanEnter: scanEnter,
                scanExit: scanExit,
                managerReportEnabled: false,
                navigateToManualReport: navigateToManualReport,
                navigateToManagerReport: navigateToManagerReport,
                navigateToReports: navigateToReports,
                scanSupported: scanner.isScannerSupported(),
                sendFailedReports: sendFailedReports,
                enterManual: enterManual,
                exitManual: exitManual
            });

            function checkUnsentReports() {
                timeReportManager.hasUnsentReports().then(function (result) {
                    $scope.hasUnsentReports = result;
                });
            }

            $scope.$on("Inspector.ReportsSendCompleted", checkUnsentReports);

            $scope.$on("Simple.BarcodeScanned",
                function (e, args) {
                    var barCode = args.barCode,
                        context = args.context;
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            onBarcodeScanned(barCode, context);
                        });
                    } else {
                        onBarcodeScanned(barCode, context);
                    }
                });



            function hasPermission(employee, requiredPermission) {
                return !!((employee.AppPermissions & requiredPermission) === requiredPermission); //(!!);
            }

            function setPermissions(employeeInfo) {
                if (hasPermission(employeeInfo, 1) && employeeInfo.EmployeeId) {
                    $scope.hasBarcodePermissions = true;
                }
                if (hasPermission(employeeInfo, 2) && employeeInfo.EmployeeId) {
                    $scope.hasManualPermissions = true;
                    $scope.hasSiteReport = employeeInfo.SiteId && employeeInfo.SiteId > 0;
                    
                }
                if (hasPermission(employeeInfo, 4)) {
                    $scope.hasManagerPermissions = true;
                }
                if (hasPermission(employeeInfo, 8)) {
                    $scope.hasPatrolPermissions = true;
                }
            }


            

            function prepare() {
                _.defer(function () {

                    timeReportManager.clearPending()
                        .then(timeReportManager.deleteOldReports);

                });
            }



        }
    ];
})(Simple, Simple.Inspector);