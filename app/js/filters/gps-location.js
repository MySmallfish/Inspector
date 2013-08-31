(function(S){
	S.GpsLocationFilter = function($filter){
    	return function(gpsLocation){
            return $filter("number")(gpsLocation.Latitude, 5) + "," + $filter("number")(gpsLocation.Longitude, 5);
    	}
	}
})(Simple);