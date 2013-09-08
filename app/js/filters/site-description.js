(function(S) {
    S.SiteDescriptionFilter = function() {
        return function(site) {
            return site ? String(site.Id) + " - " + site.Name : "";
        };
    };
})(Simple);