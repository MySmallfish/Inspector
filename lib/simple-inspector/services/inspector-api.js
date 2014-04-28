(function (S, I) {

    S.InspectorApi = function ($http, $q, configuration) {

        var baseUrl = configuration.baseUrl;
        console.log(baseUrl)
        function run(url, parameters, method) {
            return $http({
                url: [baseUrl, url].join("/"),
                method: method || "GET",
                params: method != "POST" ? parameters : null,
                data: method == "POST" ? parameters : null,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (result) {
                return result.data;
            });
        }

        function mapEvents(events) {
            return _.map(events, function (event) {
                var mappedEvent = {
                    id: event.Id,
                    name: event.Name,
                    siteId: event.SiteId,
                    date: moment(event.Date).format("DD/MM/YYYY"),
                    startTime: event.StartTime ,
                    endTime: event.EndTime
                };
                
                return mappedEvent;
            });
        }

        function getEvents(userid) {
            return run("events", { userId: userid }).then(mapEvents);

            
            //var result = $q.defer();

            //result.resolve(mapEvents(events));
            
            //return result.promise
        }

        function getEmployeeByCode(userid, barCode) {
            return run("employeeByCode", { userId: userid, code: barCode });
        }

        function getEmployeeById(employeeId) {
            return run("employee", { id: employeeId });
        }

        function getSiteById(siteId) {
            return run("site", { id: siteId });
        }

        function getSiteByCode(siteCode) {
            return run("site", { id: siteCode });
        }

        function signIn(userName, password) {
            return run("signIn", { userName: userName, password: password }, "POST");
        }

        function registerPhoneNumber(userId,employeeId, phoneNumber) {
            return run("registerPhoneNumber", { userId: userId, employeeId: employeeId, phoneNumber: phoneNumber }, "POST");
        }

        function mapReportTime(timeReport) {
            var mappedReport = {
                SiteId: timeReport.Site? timeReport.Site.Id : 0,
                EmployeeId: timeReport.Employee.Id,
                UniqueId: timeReport.UniqueId,
                BarCode: timeReport.BarCode,
                PhoneNumber: timeReport.PhoneNumber,
                EventId: timeReport.EventId,
                Time: moment(timeReport.Date).format("HH:mm"),
                Date: moment(timeReport.Date).format("DD/MM/YYYY"),
                IsEnter: timeReport.IsEnter,
                Location: timeReport.Location
        };

        return mappedReport;

        }
       
        function report(reportInfo) {
            return run("reportTimes", { reportInfo: _.map(reportInfo, mapReportTime) }, "POST");
        }

        return {
            getEvents: getEvents,
            getEmployeeByCode: getEmployeeByCode,
            getEmployeeById: getEmployeeById,
            getSiteById: getSiteById,
            getSiteByCode:getSiteByCode,
            signIn: signIn,
            report: report,
            registerPhoneNumber: registerPhoneNumber
        };
    };

})(Simple, Simple.Inspector);
