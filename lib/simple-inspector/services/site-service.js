(function (S, I) {
    I.SiteService = function ($q, inspectorApi) {
        return {
            getIdByCode: function(barCode) {
                return 1;
            },

            getById: function(id) {
                return inspectorApi.getSiteById(id);
            }
        };
    };

})(Simple, Simple.Inspector);
