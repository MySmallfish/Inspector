(function (S, I) {
    I.SiteService = function ($q, inspectorApi) {
        return {
            getIdByCode: function(barCode) {
                return inspectorApi.getSiteByCode(barCode);;
            },

            getById: function(id) {
                return 1;
            }
        };
    };

})(Simple, Simple.Inspector);
