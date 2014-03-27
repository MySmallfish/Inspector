(function (S, I) {

    I.TimeReportManager = function ($q, storageService, utils, geoLocation, siteService, employeeService, inspectorApi, loginManager) {

        function getItems() {
            return storageService.prefix("Inspector").local("items");
        }

        function queue(item) {
            return getItems().then(function (items) {
                items = items || [];
                items.push(item);
                return storageService.prefix("Inspector").local("items", items).then(function () {
                    return item;
                });
            });
        }

        function store(item) {
            return storageService.prefix("Inspector").local("item-" + item.UniqueId, item);
        }

        function retrieve(uniqueId) {
            return storageService.prefix("Inspector").local("item-" + uniqueId);
            
        }

        function remove(uniqueId) {
            return storageService.prefix("Inspector").local("item-" + uniqueId, null);
            
        }

        function send(item) {
            return inspectorApi.report([item]).then(function (items) {
                return item;
            });
        }

        function approveTimeReport(uniqueId) {
            return retrieve(uniqueId).then(function (item) {
                return send(item).then(queue).then(function (queuedItem) {
                    return remove(uniqueId).then(function () {
                        return queuedItem;
                    });
                });
            });
        }

        function storeReportInfo(reportInfo) {
            return store(reportInfo).then(function () {
                return { success: true, reportId: reportInfo.UniqueId };
            });
        }

        var locationIsMandatory = false;

        function reportTime(reportInfo) {
            
            var timeReport = angular.extend({
                UniqueId: utils.guid.create(),
                Date: new Date(),
                BarCode: reportInfo.barCode,
                IsEnter: !!reportInfo.isEnter,
                EventId: reportInfo.eventId
            });

            function onTimeReportDataReady(results) {
                var employeeInfo = results[0],
                    siteInfo = results[1],
                    locationInfo = results[2],
                    result = $q.defer(),
                    error;
                
                if (!employeeInfo) {
                    error = "EmployeeMissing";
                } else if (!siteInfo) {
                    error = "SiteMissing";
                } else if (!locationInfo && locationIsMandatory) {
                    error = "LocationNotFound";
                } else {

                    timeReport.Location = {
                        Longitude: locationInfo.longitude,
                        Latitude: locationInfo.latitude
                    };

                    timeReport.Employee = employeeInfo;
                    timeReport.Site = siteInfo;

                    result = storeReportInfo(timeReport);
                }

                if (error) {
                    
                    result.reject({ succes: false, error: error, reportId: timeReport.UniqueId });
                    result = result.promise;
                }

                return result;
            }

            var promise = $q.all(
                [
                     employeeService.getById(reportInfo.employeeId),                     
                     reportInfo.siteId ? siteService.getById(reportInfo.siteId) : siteService.getByCode(reportInfo.barCode),
                    geoLocation.get()])
                .then(onTimeReportDataReady, function (e) { console.log("error",e); });

            return promise;
        }


        function reportByCode(barCode, isEnter) {
           
            function getUser() {
                return loginManager.getCurrentUser();
            }

            function getEmployeeId(user) {
                return user.EmployeeId;
            }

            function prepareReport(employeeId) {
                var report = {
                    barCode: barCode,
                    isEnter: isEnter,
                    employeeId: employeeId
                }
                return report;
            }

            return getUser()
                        .then(getEmployeeId)
                        .then(prepareReport)
                        .then(reportTime);
        }

        function getTimeReports() {
            return getItems();
        }

        function discardReport(uniqueId) {
            remove(uniqueId);
        }

        function addTimeReport(newReport) {
            reportTime(newReport).then(function (report) {
                return approveTimeReport(report.reportId);
            })
        }

        return {
            reportByCode: reportByCode,
            report: reportTime,
            approve: approveTimeReport,
            getTimeReports: getTimeReports,
            get: retrieve,
            discard: discardReport,
            addTimeReport:addTimeReport
        };
    };


})(Simple, Simple.Inspector);
