(function (S, I) {

    I.TimeReportManager = [
        "$q",
        "$rootScope",
        "storageService",
        "utils",
        "geoLocation",
        "siteService",
        "employeeService",
        "inspectorApi",
        "loginManager",
        "$log",
        function ($q, $rootScope, storageService, utils, geoLocation, siteService, employeeService, inspectorApi, loginManager, $log) {

            function getItems() {
                return storageService.prefix("Inspector").local("items");
            }

            function queue(item) {
                $log.debug("Queue a report", item);
                return getItems().then(function (items) {
                    $log.debug("Got stored items", items);
                    items = items || [];
                    item.Status = I.SendStatus.Queued;
                    items.push(item);
                    return storageService.prefix("Inspector").local("items", items).then(function () {
                        $log.debug("Items stored", items);
                        return item;
                    }, $log.error);
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
                var filteredReports = _.filter(reports, function (item) {
                    return item.Status == I.SendStatus.Queued || item.Status == I.SendStatus.Failed;
                });
                $log.debug("Filter Reports, all, filtered", reports, filteredReports);
                return filteredReports;
            }

            function hasUnsentReports() {
                return getItems()
                    .then(filterReports)
                    .then(function (reports) {
                        return reports.length > 0;
                    });
            }

            function sendItems(reports) {
                var result = $q.defer();

                inspectorApi.report(reports).then(function (response) {

                    if (response && response.length) {
                        $log.debug("Reports sent.");
                        _.each(reports, function (report) {

                            var reportStatus = _.find(response, function (r) { return r.UniqueId == report.UniqueId; });
                            console.log("Report", report, reportStatus, response);
                            if (!reportStatus || !reportStatus.Success) {
                                report.Status = I.SendStatus.Failed;
                            } else {
                                report.Status = I.SendStatus.Sent;
                            }
                        });
                        result.resolve(reports);
                    } else {
                        $log.error("Error sending reports (rejecting , sendItems)", response);
                        result.reject(response);
                    }
                }, function (e) {
                    $log.error("Error sending reports (rejecting , sendItems)", e);
                    result.reject(e);
                });
                return result.promise;
            }

            function setSuccess(reports) {
                if (reports && reports.length) {
                    var successful = _.filter(reports, function (r) { return r.Status !== I.SendStatus.Failed; });

                    var failed = _.filter(reports, function (r) { return r.Status === I.SendStatus.Failed; });

                    return setFailed(failed).then(function () {
                        return setStatus(successful, I.SendStatus.Sent);
                    });
                } else {
                    return $q.when(reports);
                }
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

                return reports && reports.length ? $q.when(reports).then(save) : $q.when(reports);

            }

            function clearPending() {
                return getTimeReports().then(function (reports) {
                    var items = _.map(reports, function (report) {
                        if (report.Status === I.SendStatus.Pending) {
                            report.Status = I.SendStatus.Failed;
                        }
                        return report;
                    });
                    return storageService.prefix("Inspector").local("items", items);
                });
            }

            function filterOldReports(reports) {
                var result = $q.defer();

                var filteredReports = _.filter(reports, function (report) {
                    return report.Status !== I.SendStatus.Sent || moment().subtract('days', 5).unix() <= moment(report.Date).unix();
                });

                result.resolve(filteredReports);
                return result.promise;
            }

            function deleteOldReports() {
                return getTimeReports().then(function (reports) {
                    return filterOldReports(reports).then(function (items) {
                        return storageService.prefix("Inspector").local("items", items);
                    });
                });
            }

            function save(reports) {
                $log.debug("Saving reports", reports);
                return getItems().then(function (items) {
                    for (var i = 0; i < items.length; i++) {
                        var reportToSave = _.find(reports, function (report) { return report.UniqueId == items[i].UniqueId; });

                        if (reportToSave) {
                            items[i] = reportToSave;
                        }
                    }
                    return items;
                }).then(function (items) {
                    $log.debug("Storing items", items);
                    return storageService.prefix("Inspector").local("items", items).then(function () {
                        return reports;
                    });
                });

            }

            function publishSendCompleted() {
                publish("Inspector.ReportsSendCompleted");
            }

            function publish(name, args) {

                $rootScope.$broadcast(name, args);
            }

            function send() {
                _.defer(function () {
                    $log.info("Sending reports...");
                    getTimeReports()
                        .then(filterReports)
                        .then(setPending)
                        .then(sendItems)
                        .then(setSuccess, setFailed)
                        .then(deleteOldReports)
                        .then(publishSendCompleted)
                        .catch(function (e) {
                            $log.error("Error sending reports (whole process failed)", e);
                        });
                });

                return $q.when({});
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

            function reduce(site) {
                return {
                    Id: site.Id,
                    Name: site.Name
                };
            }

            function reportTime(reportInfo) {

                var timeReport = angular.extend({
                    UniqueId: utils.guid.create(),
                    Date: new Date(),
                    BarCode: reportInfo.barCode,
                    IsEnter: !!reportInfo.isEnter
                });
                function onTimeReportDataReady(results) {
                    var employeeInfo = results[0],
                        siteInfo = results[1],
                        locationInfo = results[2],
                        phoneNumber = results[3],
                        result = $q.defer(),
                        error;

                    if (!employeeInfo) {
                        error = "EmployeeMissing";
                    } else if (!siteInfo) {
                        error = "SiteMissing";
                    } else if (!locationInfo && locationIsMandatory) {
                        error = "LocationNotFound";
                    } else {
                        if (locationInfo) {
                            timeReport.Location = {
                                Longitude: locationInfo.longitude,
                                Latitude: locationInfo.latitude
                            };
                        }

                        timeReport.Employee = employeeInfo;
                        if (siteInfo.eventId) {
                            timeReport.EventId = siteInfo.eventId;
                        } else {
                            timeReport.Site = reduce(siteInfo);
                        }
                        timeReport.PhoneNumber = phoneNumber;

                        result = storeReportInfo(timeReport);
                    }

                    if (error) {

                        result.reject({ succes: false, error: error, reportId: timeReport.UniqueId });
                        result = result.promise;
                    }

                    return result;
                }

                var promise = $q.all([
                         reportInfo.employeeId ? employeeService.getById(reportInfo.employeeId) : reportInfo.employee,
                         reportInfo.siteId ? siteService.getById(reportInfo.siteId) : $q.when({ eventId: reportInfo.eventId }),
                        getLocation(locationIsMandatory),
                        loginManager.getRegisteredPhoneNumber().then(function (phoneNumber) { return phoneNumber.number; })
                ])
                    .then(onTimeReportDataReady);

                return promise;
            }

            function getLocation(isMandatory) {
                console.log("GET LOC!", isMandatory);
                var result = $q.defer();
                var timedout = false, resolved = false;

                function onError(e) {
                    if (isMandatory) {
                        result.reject(e);
                    } else {
                        resolved = true;
                        result.resolve(null);
                    }
                }

                setTimeout(function () {
                    if (!timedout && !resolved) {
                        timedout = true;
                        onError("Timeout");
                    }
                }, 10000);
                geoLocation.get().then(function (position) {
                    resolved = true;

                    result.resolve(position);
                }, onError);

                return result.promise;
            }


            function reportByCode(barCode, isEnter) {
                function getUser() {
                    return loginManager.getCurrentUser();
                }

                function getEmployee(user) {
                    return { Id: user.EmployeeId };
                }

                function prepareReport(employee) {
                    var report = {
                        barCode: barCode,
                        isEnter: isEnter,
                        employee: employee,
                        siteId: barCode
                    };
                    return report;
                }

                return getUser()
                            .then(getEmployee)
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
        }];


})(Simple, Simple.Inspector);
