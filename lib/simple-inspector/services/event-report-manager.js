(function (S, I) {
    I.EventReportManager = function ($q, timeReportManager, inspectorApi) {

        var events = [];

        function getReportsByEventId(eventId) {

            return timeReportManager.getTimeReports().then(function (reports) {
                
                return (_.filter(reports, function (report) {
                    return report.EventId == eventId;
                }));

            });
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
