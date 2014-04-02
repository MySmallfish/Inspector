(function (S, I) {
    I.SiteService = function ($q, inspectorApi) {
        return {
            getByCode: function(barCode) {
                return inspectorApi.getSiteByCode(barCode);
            },

            getById: function(id) {
                return inspectorApi.getSiteById(id);
            }
        };
    };

})(Simple, Simple.Inspector);
