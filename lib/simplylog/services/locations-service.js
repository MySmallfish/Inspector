(function (S, SL) {

    SL.LocationsService = function ($q, queueManager, $http, configurationManager, $cacheFactory, entityManager) {
        var sitePermitsCache = $cacheFactory("sitePermits"),
            sitesCache = $cacheFactory("sites");

        var permitsQueue = queueManager.get({
            name: "Permits",
            processItemAction: sendPermit
        });

        function sendPermit(permit) {
            console.log("SENDING PERMIT: ", permit);
            var result = $q.defer();
            result.resolve(permit);
            return result.promise;
        }

        function saveSitePermits(siteId, permits) {
            return validateSitePermits(permits)
                            .then(function (items) {
                                var cachedPermits = sitePermitsCache.get(siteId);
                                if (!cachedPermits) {
                                    cachedPermits = [];
                                    sitePermitsCache.put(siteId, cachedPermits);
                                }
                                
                                items = _.map(items, function (item) {
                                    return {
                                        SiteId: siteId,
                                        PermitTypeId: item.Type.Id,
                                        EffectiveDate: item.EffectiveDate
                                    };
                                });

                                _.each(items, function (permit) {
                                    permitsQueue.push(permit);
                                    cachedPermits.push(permit);
                                });
                            })
                            .then(runPermitsQueue);
        }

        function validateSitePermits(permits) {
            var result = $q.defer();
            result.resolve(permits);
            return result.promise;
        }

        function runPermitsQueue() {
            permitsQueue.run();
        }

        function getSitePermits(siteId) {
            var apiAddress = configurationManager.get("Api.Address");
            var cachedPermits = sitePermitsCache.get(siteId);
            if (cachedPermits) {
                return $q.when(cachedPermits);
            } else {
                return $http({
                    method: "POST",
                    url: apiAddress + "Site(" + siteId + ")/RequiredPermits",
                    header: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).then(function (data) {
                    var items = _.map(data.data.value, function (item) {
                        return {
                            Id: item.PermitId || 0,
                            HasPermit: Boolean(item.PermitId),
                            EffectiveDate: item.EffectiveDate,
                            Type: {
                                Id: item.PermitTypeId,
                                Name: item.PermitTypeName,
                                DaysDuration: item.PermitTypeDaysDuration
                            }
                        };
                    });
                    sitePermitsCache.put(siteId, items);
                    return items;
                });
            }
        }

        function mapSite(site) {
            var item = {
                Id: site.Id,
                Name: site.Name,
                Address: site.Address
            };
            item.SiteGeoGroup = {
                Id: site.SiteGeoGroupId,
                Name: site.SiteGeoGroupName
            };
            delete item.SiteGeoGroupId;
            delete item.SiteGeoGroupName;
            return item;
        }

        function getSite(id) {
            return entityManager.get().then(function (em) {
                return $q.when(em.fetchEntityByKey("Site", id, true));
            }).then(function (site) {
                site = site.entity;
                return {
                    Id: site.Id,
                    Name: site.Name
                };
            });
        }

        function getSites(employeeId) {
            var query = breeze.EntityQuery.from("Site");

            var cachedSites = sitesCache.get(employeeId);
            if (cachedSites) {
                return $q.when(cachedSites);
            } else {
                return entityManager.get().then(function (em) {
                        return $q.when(em.executeQuery(query));
                    }).then(function(data) {
                    var sites = _.map(_.filter(data.results, function(s) {
                        return s.Name && s.Name.length;
                    }), mapSite);
                    sitesCache.put(employeeId, sites);
                    return sites;
                });
            }
        }

        return {
            getSites: getSites,
            getSitePermits: getSitePermits,
            saveSitePermits: saveSitePermits,
            validateSitePermits: validateSitePermits,
            getSite: getSite
        };
    };

})(Simple, SimplyLog);
