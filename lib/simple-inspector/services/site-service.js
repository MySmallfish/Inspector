(function (S, I) {
    I.SiteService = function ($q, inspectorApi, storageService) {

        function siteInfo(id, value) {
            return storageService.prefix("Inspector").local("Site-" + String(id), value);
        }

        function getFromServerByBarCode(barCode) {
            return inspectorApi.getSiteByCode(barCode);
        }

        function getFromServerById(id) {
            return inspectorApi.getSiteById(id);
        }
        
        function isValidToken(site) {
            return moment().subtract('days', 7).unix() <= moment(site.Date).unix();
        }

        function getFromStorage(id, getFromServer) {
            return siteInfo(id).then(function (site) {
                if (site && isValidToken) {
                    return site.Site;
                } else {
                    return getFromServer(id).then(function (currentSite) {
                        siteInfo(currentSite.Id, { Site: currentSite, Date: moment() });
                        return currentSite;
                    });
                }
                
            });
        }

        return {
            getByCode: function (barCode) {
                return getFromStorage(barCode, getFromServerByBarCode);
            },
            getById: function (id) {
                return getFromStorage(id, getFromServerById);
            }
        };
    };

})(Simple, Simple.Inspector);
