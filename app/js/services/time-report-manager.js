(function(S) {
    S.TimeReportManager = function ($q, storageService, utils, geoLocation) {

        function queue(item) {
            return storageService.prefix("Inspector").local("items").then(function (items) {
                items = items || [];
                items.push(item);
                return storageService.prefix("Inspector").local("items", items).then(function() {
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
            return retrieve(uniqueId).then(function(item) {
                return queue(item).then(function(queuedItem) {
                    return remove(uniqueId).then(function() {
                        return queuedItem;
                    });
                });
            });
        }

        function getCurrentSite() {
            return { Id: 2, Name: "האתר הראשון" };
        }

        function storeReportInfo(reportInfo) {
            return store(reportInfo).then(function () {
                return { success: true, reportId: reportInfo.UniqueId };
            });
        }

        var locationIsMandatory = false;
        function reportTime(reportInfo) {
            
            reportInfo = angular.extend({
                UniqueId: utils.guid.create(),
                Date: new Date(),
                Site: getCurrentSite()
            }, reportInfo);
            var r = $q.defer();
            var promise =
                geoLocation.get().then(function(locationInfo) {
                    console.log("SUCCESS", locationInfo);
                    return storeReportInfo(reportInfo).then(function (ri) {
                        return ri;
                    });
                }, function(e) {
                    console.log("FAIL", e);
                    return storeReportInfo(reportInfo).then(function(ri) {
                        return ri;
                    });
                });
            //var promise = geoLocation.get().then(function (locationInfo) {
            //    console.log(JSON.stringify(locationInfo));
            //    alert(JSON.strinify(locationInfo));
            //    reportInfo.Location = {};
            //    return storeReportInfo(reportInfo);
            //}, function (error) {
            //    console.log("ERROR");
            //    if (!locationIsMandatory) {
            //        return storeReportInfo(reportInfo);
            //    } else {
            //        return { success: false, reportId: reportInfo.UniqueId };
            //    }
            //});

            return promise;
        }

        function reportByCode(barCode) {
            return reportTime({ barCode: barCode });
        }

        return {
            reportByCode: reportByCode,
            report: reportTime,
            approve: approveTimeReport,
            get: retrieve
        };
    };

})(Simple);