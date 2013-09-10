(function (S) {
    S.GeoLocationService = function($q, $rootScope) {

        function getLocation() {
            var result = $q.defer();
            navigator.geolocation.getCurrentPosition(result.resolve, result.reject);
            return result.promise;
        }

        return {
            get: getLocation
        };
    };
})(Simple);