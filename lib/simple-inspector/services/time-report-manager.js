(function (S, I) {

    I.TimeReportManager = function ($q, storageService, utils, geoLocation, siteService, employeeService) {
        var events = [{
            Id: 1,
            Name: "event1",
            SiteCode: 111
        }, {
            Id: 2,
            Name: "event2",
            SiteCode: 222
        }, {
            Id: 3,
            Name: "event3",
            SiteCode: 333
        }];

        function getEvents() {
            var result = $q.defer();

            result.resolve(events);

            return result.promise;
        }

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

        function approveTimeReport(uniqueId) {
            return retrieve(uniqueId).then(function (item) {
                return queue(item).then(function (queuedItem) {
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
                IsEnter: !!reportInfo.isEnter
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
                }

                return result;
            }

            var promise = $q.all(
                [employeeService.getById(reportInfo.employeeId),
                siteService.getById(reportInfo.siteId),
                geoLocation.get()])
                .then(onTimeReportDataReady);

            return promise;
        }


        function reportByCode(barCode, isEnter) {
            return reportTime({
                barCode: barCode,
                isEnter: isEnter
            });
        }

        function getTimeReports() {
            return getItems();
        }

        function discardReport(uniqueId) {
            remove(uniqueId);
        }

        return {
            reportByCode: reportByCode,
            report: reportTime,
            approve: approveTimeReport,
            getTimeReports: getTimeReports,
            get: retrieve,
            discard: discardReport,
            getEvents: getEvents
        };
    };


})(Simple, Simple.Inspector);
