(function (S, I) {
    I.EventReportManager = function ($q) {

        var events = [{
            Id: 1,
            Name: "event1",
            SiteCode: 111,
            Date: "1/1/14"
        }, {
            Id: 2,
            Name: "event2",
            SiteCode: 222,
            Date: "2/2/14"
        }, {
            Id: 3,
            Name: "event3",
            SiteCode: 333,
            Date: "3/3/14"
        }];

        function getEvents() {
            var result = $q.defer();

            result.resolve(events);

            return result.promise;
        }

        function getEventById(eventId) {
            var result = $q.defer();
            result.resolve({
                Id: 1,
                Name: "event1",
                SiteCode: 111,
                Date: "1/1/14"
            });
            
            return result.promise;
        };

        return {
            getEvents: getEvents,
            getEventById: getEventById
        };
    };

})(Simple, Simple.Inspector);
