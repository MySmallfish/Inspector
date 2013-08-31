(function(S){
	S.SiteDescriptionFilter = function(){
	    return function(site){
	        return String(site.Id) + " - " + site.Name;
	    }
	}
})(Simple);