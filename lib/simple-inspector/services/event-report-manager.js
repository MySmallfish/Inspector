(function (S, I) {
    I.EventReportManager = function ($q, timeReportManager, inspectorApi) {

        var timeReports = [{
            id: 111,
            employeeName: "shir",
            enterTime: "9:00",
            exitTime: "17:00"
        },
        {
            id: 222,
            employeeName: "yair",
            enterTime: "10:30",
            exitTime: "17:30"
        },
        {
            id: 333,
            employeeName: "aaa",
            enterTime: "9:30",
            exitTime: "14:00"
        },
        {
            id: 444,
            employeeName: "bbb",
            enterTime: "8:00",
            exitTime: "16:00"
        }];

        var events = [];

        function getReportsByEventId(eventId) {

            timeReportManager.getTimeReports().then(function (reports) {
                console.log("REPORTSSS", reports, eventId);
                //_.filter(reports, function(report){ return report.id === ; })) 

            });

            var result = $q.defer();

            result.resolve(timeReports);

            return result.promise;
        }

        function getEvents(userid) {
            return inspectorApi.getEvents(userid).then(function (items) {
                events = items;
                return items;
            });
        }
        
        function getEventById(eventId) {
            var result = $q.defer();
            
            result.resolve(_.find(events, function (event) {
                return parseInt(event.id, 10) == eventId;
            }));
            
            return result.promise;
        };

        

        return {
            getEvents: getEvents,
            getEventById: getEventById,
            getReportsByEventId: getReportsByEventId
        };
    };

})(Simple, Simple.Inspector);
