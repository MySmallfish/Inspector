(function (S, SL) {

    SL.SelectLocationController = [
        "$scope", "$routeParams", "utils", "$location", "safeApply", "locationDataService", "$q", "textResource",
        function ($scope, $routeParams, utils, $location, safeApply, locationDataService, $q, textResource) {
            $scope.changeHeader(textResource.get("SelectLocation"));
            function loadLocations() {
                var result = $q.all([
                        getLocations("SiteGeoGroup"),
                        getLocations("Site"),
                        getLocations("Building"),
                        getLocations("Cell")
                ]);
                return result.then(function (allResults) {
                    var itemsMap = { SiteGeoGroup: {}, Site: {}, Building: {}, Cell: {} }, items = _.map(allResults[0], function (siteGeoGroup) {
                        var item = {
                            Id: siteGeoGroup.Id,
                            EntityName: "SiteGeoGroup",
                            Text: siteGeoGroup.Name,
                            Path: siteGeoGroup.Path,
                            FullName: siteGeoGroup.Name
                        };
                        itemsMap["SiteGeoGroup"][siteGeoGroup.Id] = item;
                        return item;
                    });
                    items = _.union(items, _.map(allResults[1], function (site) {
                        var item = {
                            Id: site.Id,
                            EntityName: "Site",
                            ParentEntityName: "SiteGeoGroup",
                            Text: site.Name,
                            Path: site.Path,
                            FullName: site.FullName,
                            ParentId: site.SiteGeoGroupId
                        };
                        if (itemsMap["SiteGeoGroup"][site.SiteGeoGroupId]) {
                            itemsMap["SiteGeoGroup"][site.SiteGeoGroupId].HasChildren = true;
                        }
                        itemsMap["Site"][site.Id] = item;
                        return item;
                    }));
                    items = _.union(items, _.map(allResults[2], function (building) {
                        var item = {
                            Id: building.Id,
                            EntityName: "Building",
                            ParentEntityName: "Site",
                            Text: building.Name,
                            Path: building.Path,
                            FullName: building.FullName,
                            ParentId: building.SiteId
                        };
                        if (itemsMap["Site"][building.SiteId]) {
                            itemsMap["Site"][building.SiteId].HasChildren = true;
                        }
                        itemsMap["Building"][building.Id] = item;
                        return item;
                    }));
                    items = _.union(items, _.map(allResults[3], function (cell) {
                        var item = {
                            Id: cell.Id,
                            EntityName: "Cell",
                            ParentEntityName: "Building",
                            Text: cell.Text,
                            Path: cell.Path,
                            FullName: cell.FullName,
                            ParentId: cell.BuildingId
                        };
                        if (itemsMap["Building"][cell.BuildingId]) {
                            itemsMap["Building"][cell.BuildingId].HasChildren = true;
                        }
                        itemsMap["Cell"][cell.Id] = item;
                        return item;

                    }));
                    return items;
                }).then(function (items) {
                    $scope.locations = items;
                });
            }

            function getLocations(entityName) {
                return locationDataService["get" + entityName + "s"]({});
            }


            loadLocations();

            $scope.confirmSelection = function () {
                if ($scope.selectedLocation) {
                    var parameters = {
                        stateId: $routeParams.stateId
                    };
                    parameters[$routeParams.parameterName + "Id"] = $scope.selectedLocation.Id;
                    if ($scope.selectedLocation.EntityName) {
                        parameters[$routeParams.parameterName + "EntityName"] = $scope.selectedLocation.EntityName;
                    }
                    $location.path("NewIncident").search(parameters);
                }
            };

        }
    ];

})(Simple, SimplyLog);

