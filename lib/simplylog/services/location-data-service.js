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
                return simplyLogDatabase.get().then(function (db) {
                    var siteGeoGroups = db.SiteGeoGroups;
                    if (parameters && parameters.Id) {
                        siteGeoGroups.where(["Id", "=", parameters.Id]);
                    }

                    return siteGeoGroups.select();
                });
            }
            function getSites(parameters) {
                return simplyLogDatabase.get().then(function (db) {
                    var sites = db.Sites;
                    if (parameters && parameters.SiteGeoGroupId) {
                        sites.where(["SiteGeoGroupId", "=", parameters.SiteGeoGroupId]);
                    }
                    if (parameters && parameters.Id) {
                        sites.where(["Id", "=", parameters.Id]);
                    }

                    return sites.select();
                });
            }
            function getBuildings(parameters) {
                return simplyLogDatabase.get().then(function (db) {
                    var buildings = db.Buildings;

                    if (parameters && parameters.SiteId) {
                        buildings.where(["SiteId", "=", parameters.SiteId]);
                    }
                    if (parameters && parameters.Id) {
                        buildings.where(["Id", "=", parameters.Id]);
                    }

                    return buildings.select();
                });
            }

            function getCells(parameters) {
                return simplyLogDatabase.get().then(function (db) {
                    var cells = db.Cells;
                    if (parameters && parameters.BuildingId) {
                        cells.where(["BuildingId", "=", parameters.BuildingId]);
                    }
                    if (parameters && parameters.Id) {
                        cells.where(["Id", "=", parameters.Id]);
                    }
                    return cells.select();
                });
            }

            function getLocation(id, entityName) {
                return api["get" + entityName + "s"]({ Id: id }).then(function (items) {
                    return _.extend(_.first(items), { EntityName: entityName });
                });
            }

            var api = {
                getSiteGeoGroups: getSiteGeoGroups,
                getSites: getSites,
                getBuildings: getBuildings,
                getCells: getCells,
                getLocation: getLocation,
                fetchSiteGeoGroups: fetchSiteGeoGroups,
                fetchSites: fetchSites,
                fetchBuildings: fetchBuildings,
                fetchCells: fetchCells
            };
            return api;
        }
    ];

})(Simple, SimplyLog);
