(function (S, I) {

    S.InspectorApi = function ($http, $q, configuration) {

        var baseUrl = configuration.baseUrl;

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

            return run("site", { id: 1234 });
        }

        function signIn(UserName, Password) {
            return run("signIn", { userName: UserName, password: Password }, "POST");
        }

        function mapReportTime(report) {
            console.log("mapReportTime", report);
            var mappedReport = {
                SiteId:report.Site.Id,
                EmployeeId:report.Employee.Id,
                UniqueId:report.UniqueId,
                EventId:report.EventId,
                Time: moment(event.Date).format("HH-mm"),
                Date: moment(event.Date).format("dd/MM/yyyy"),
                IsEnter:report.IsEnter,
                Location: report.Location
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
            signIn: signIn,
            report: report
        };
    };

})(Simple, Simple.Inspector);
