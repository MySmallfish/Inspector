(function (S, SL) {

    SL.LocationDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        "entityUpdateProcessor",
        "simplyLogDatabase",
        function ($cacheFactory, $q, entityManager, simplyLogApiClient, entityUpdateProcessor, simplyLogDatabase) {

            function getActiveItemsQuery(entity) {
                var query = breeze.EntityQuery.from(entity)
                                .where("RowStatus", "==", 0);
                return query;
            }

            function queryItems(entity, prepareQuery) {
                var query = getActiveItemsQuery(entity);
                if (prepareQuery) {
                    query = prepareQuery(query);
                }
                return entityManager.query(query).then(function (data) {
                    return data.results;
                });
            }

            function fetchSiteGeoGroups() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("SiteGeoGroup"), "SiteGeoGroups");
                return processor.process();
            }

            function fetchSites() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("Site"), "Sites");
                return processor.process();
            }

            function fetchBuildings() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("Building"), "Buildings");
                return processor.process();
            }

            function fetchCells() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("Cell"), "Cells");
                return processor.process();
            }


            function getSiteGeoGroups(parameters) {
                return simplyLogDatabase.SiteGeoGroups.select();
            }
            function getSites(parameters) {
                var sites = simplyLogDatabase.Sites;
                if (parameters && parameters.SiteGeoGroupId) {
                    sites.where(["SiteGeoGroupId", "=", parameters.SiteGeoGroupId]);
                }
                return sites.select();
            }
            function getBuildings(parameters) {
                var buildings = simplyLogDatabase.Buildings;

                if (parameters && parameters.SiteId) {
                    buildings.where(["SiteId", "=", parameters.SiteId]);
                }

                return buildings.select();
            }

            function getCells(parameters) {
                var cells = simplyLogDatabase.Cells;
                if (parameters && parameters.BuildingId) {
                    cells.where(["BuildingId", "=", parameters.BuildingId]);
                }
                return cells.select();
            }


            return {
                getSiteGeoGroups: getSiteGeoGroups,
                getSites: getSites,
                getBuildings: getBuildings,
                getCells: getCells,
                fetchSiteGeoGroups: fetchSiteGeoGroups,
                fetchSites: fetchSites,
                fetchBuildings: fetchBuildings,
                fetchCells: fetchCells
            };
        }
    ];

})(Simple, SimplyLog);
