(function (S, I) {

    I.TimeReportManager = function ($q, storageService, utils, geoLocation, siteService, employeeService, inspectorApi, loginManager) {

        function getItems() {
            return storageService.prefix("Inspector").local("items");
        }

        function queue(item) {
            return getItems().then(function (items) {
                items = items || [];
                item.Status = I.SendStatus.Queued;
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

        function remove(uniqueId, context) {
            return storageService.prefix("Inspector").local("item-" + uniqueId, null).then(function () {
                return context;
            });

        }

        I.SendStatus = {
            Queued: 0,
            Failed: 1,
            Sent: 2,
            Pending: 3
        };

        function filterReports(reports) {
            return _.filter(reports, function (item) {
                return item.Status == I.SendStatus.Queued || item.Status == I.SendStatus.Failed;
            });
        }

        function hasUnsentReports() {
            return getItems()
                .then(filterReports)
                .then(function (reports) {
                    return reports.length > 0;
                });
        }

        function sendItems(reports) {
            return _.each(reports, function (timeReport) {
                return inspectorApi.report([timeReport]).then(function (item) {
                    item.Status = I.SendStatus.Sent;
                    return item;
                }, function (item) {
                    item.Status = I.SendStatus.Failed;
                    return item;
                });
            });
        }

        function setSuccess(reports) {
            return setStatus(reports, I.SendStatus.Sent);
        }

        function setFailed(reports) {
            return setStatus(reports, I.SendStatus.Failed);
        }
        function setPending(reports) {
            return setStatus(reports, I.SendStatus.Pending);
        }

        function setStatus(reports, status) {
            _.each(reports, function (timeReport) {
                timeReport.Status = status;
            });
            return $q.when(reports).then(save);

        }

        function clearPending() {
            getTimeReports().then(function (reports) {
                return _.map(reports, function (report) {
                    if (report.Status === I.SendStatus.Pending) {
                        report.Status = I.SendStatus.Failed;
                    }
                    return report;
                });
            }).then(function (items) {
                return storageService.prefix("Inspector").local("items", items);
            });
        }

        function filterOldReports(reports) {
            var result = $q.defer();

            result.resolve(_.filter(reports, function (report) {
                return report.Status !== I.SendStatus.Sent || moment().subtract('months', 2) <= moment(report.Date);
            }));

            return result.promise;
        }

        function deleteOldReports() {
            getTimeReports().then(function (reports) {
                return filterOldReports(reports).then(function (items) {
                    return storageService.prefix("Inspector").local("items", items);
                });
            });
        }

        function save(reports) {
            return getItems().then(function (items) {

                for (var i = 0; i < items.length; i++) {
                    var reportToSave = _.find(reports, function (report) { return report.UniqueId == items[i].UniqueId; });

                    if (reportToSave) {
                        items[i] = reportToSave;
                    }
                }
                return items;
            }).then(function (items) {
                return storageService.prefix("Inspector").local("items", items).then(function () {
                    return items;
                });
            });

        }

        function send() {
            _.defer(function () {
                getTimeReports()
                    .then(filterReports)
                    .then(setPending)
                    .then(sendItems)
                    .then(setSuccess, setFailed);
            });
        }

        function removeApprovedItem(queuedItem) {
            return remove(queuedItem.UniqueId, queuedItem);
        }

        function approveTimeReport(uniqueId) {
            return retrieve(uniqueId)
                    .then(queue)
                    .then(removeApprovedItem)
                    .then(send);
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
                .then(onTimeReportDataReady, function (e) { console.log("error", e); });

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
                };
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
            });
        }

        return {
            reportByCode: reportByCode,
            report: reportTime,
            approve: approveTimeReport,
            getTimeReports: getTimeReports,
            get: retrieve,
            discard: discardReport,
            addTimeReport: addTimeReport,
            send: send,
            hasUnsentReports: hasUnsentReports,
            clearPending: clearPending,
            deleteOldReports: deleteOldReports
        };
    };


})(Simple, Simple.Inspector);
