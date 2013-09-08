(function(S) {
    S.GpsLocationFilter = function($filter) {
        return function(gpsLocation) {
            return gpsLocation ? $filter("number")(gpsLocation.Latitude, 5) + "," + $filter("number")(gpsLocation.Longitude, 5) : "";
        };
    };
})(Simple);