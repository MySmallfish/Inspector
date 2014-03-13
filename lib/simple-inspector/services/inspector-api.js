(function (S, I) {

    S.InspectorApi = function ($http, $q, configuration) {

        var baseUrl = configuration.baseUrl;

        function run(url, parameters) {
            return $http({
                url: [baseUrl, url].join("/"),
                method: "GET",
                params: parameters
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
                    date: moment(event.Date).format("D-MM-YYYY"),
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
            return run("employeeByCode", { userId: userid, code: 89317 });
        }

        function getEmployeeById(employeeId) {
            return run("employee", { id: employeeId });
        }

        function getSiteById(siteId) {

            return run("site", { id: 1234 });
        }

        return {
            getEvents: getEvents,
            getEmployeeByCode: getEmployeeByCode,
            getEmployeeById: getEmployeeById,
            getSiteById: getSiteById
        };
    };

})(Simple, Simple.Inspector);
