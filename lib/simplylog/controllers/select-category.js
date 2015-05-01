(function (S, SL) {

    SL.SelectCategoryController = [
        "$scope", "$routeParams", "utils", "$location", "safeApply", "categoryDataService", "$q","textResource",
        function ($scope, $routeParams, utils, $location, safeApply, categoryDataService, $q, textResource) {
            $scope.changeHeader(textResource.get("SelectCategory"));
            function loadCategories() {
                var parameters = {};
                if ($routeParams.limitPath) {
                    parameters.Path = decodeURIComponent($routeParams.limitPath);
                }
                var result = categoryDataService.getCategories(parameters);
                return result.then(function (categories) {
                    var categoriesMap = {}, items = _.map(categories, function (category) {
                        var item = {
                            Id: category.Id,
                            Text: category.Name,
                            Path: category.Path,
                            FullName: category.FullName,
                            ParentId: category.ParentId
                        };

                        categoriesMap[category.Id] = item;

                        return item;
                    });

                    _.each(items, function(item) {
                        if (item.ParentId) {
                            categoriesMap[item.ParentId].HasChildren = true;
                        }
                    });

                    return items;
                }).then(function (items) {
                    $scope.categories = items;
                });
            }


            loadCategories();

            $scope.confirmSelection = function () {
                if ($scope.selectedCategory) {
                    var parameters = {
                        stateId: $routeParams.stateId
                    };
                    parameters[$routeParams.parameterName + "Id"] = $scope.selectedCategory.Id;

                    $location.path("NewIncident").search(parameters);
                }
            };

        }
    ];

})(Simple, SimplyLog);

