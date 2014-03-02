(function (S, I) {
    I.SiteService = function ($q) {
        return {
            getIdByCode: function(barCode) {
                return 1;
            },
            getById: function(id) {
                var result = $q.defer();
                result.resolve({ Id: id || 1, Name: "האתר הראשון" });
                return result.promise;
            }
        };
    };

})(Simple, Simple.Inspector);
