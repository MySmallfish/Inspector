(function (S, I) {

    S.InspectorApi = function ($http, $q, configuration) {

        //var events = [
        //    {
        //        "Id": 1,
        //        "IsActive": false,
        //        "Name": "הפועל חיפה",
        //        "SiteName": "סחנין בית\"ר",
        //        "Date": "/Date(1390600800000+0200)/",
        //        "DateValue": "2014-01-25",
        //        "EndTime": "8:00 PM",
        //        "SiteId": 30772,
        //        "StartTime": "4:00 PM"
        //    },
        //    {
        //        "Id": 2,
        //        "IsActive": false,
        //        "Name": "הפועל טבעון 2",
        //        "SiteName": "כדורסל הפועל חיפה",
        //        "Date": "/Date(1389823200000+0200)/",
        //        "DateValue": "2014-01-16",
        //        "EndTime": "8:30 PM",
        //        "SiteId": 30513,
        //        "StartTime": "5:30 PM"
        //    },
        //    {
        //        "Id": 3,
        //        "IsActive": false,
        //        "Name": "מכבי חיפה",
        //        "SiteName": "הפועל מרמורק",
        //        "Date": "/Date(1389996000000+0200)/",
        //        "DateValue": "2014-01-18",
        //        "EndTime": "4:00 PM",
        //        "SiteId": 30774,
        //        "StartTime": "2:00 PM"
        //    },
        //    {
        //        "Id": 4,
        //        "IsActive": false,
        //        "Name": "הפועל כפר יהושע",
        //        "SiteName": "הפועל כפר יהושע",
        //        "Date": "/Date(1389996000000+0200)/",
        //        "DateValue": "2014-01-18",
        //        "EndTime": "9:00 PM",
        //        "SiteId": 30775,
        //        "StartTime": "4:00 PM"
        //    }
        //];


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

        return {
            getEvents: getEvents
        };
    };

})(Simple, Simple.Inspector);
