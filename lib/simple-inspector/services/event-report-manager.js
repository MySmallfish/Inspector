(function (S, I) {
    I.EventReportManager = function ($q, timeReportManager) {

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

        function getReports() {
            var result = $q.defer();

            result.resolve(timeReports);

            return result.promise;
        }

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
            getEventById: getEventById,
            getReports: getReports
        };
    };

})(Simple, Simple.Inspector);
