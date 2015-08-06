(function (S) {
    S.GeoLocationService = ["$q", function($q) {

        function getLocation(options) {
            options = _.defaults(options || {}, { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 });
            
            var result = $q.defer();
            navigator.geolocation.getCurrentPosition(function (geoPosition) {
                result.resolve(geoPosition.coords);
            }, function(e) {
                result.reject(e);
            },
            options);
            
            return result.promise;
        }

        return {
            get: getLocation
        };
    }];
})(Simple);