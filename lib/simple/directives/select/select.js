(function (S) {

    S.SelectDirective = [function () {

        return {
            restrict: 'E',
            scope: {
                load: "&",
                ngModel: "=",
                isHierarchical: "@",
                useColorHint: "@",
                matchType:"@"
            },
            require: "^ngModel",
            replace: true,
            templateUrl: "lib/simple/directives/select/select.html",
            controller: [
                "$scope",
                "$q",
                "safeApply",
                function ($scope, $q, safeApply) {
                    function isHierarchical() {
                        return $scope.isHierarchical == "true";
                    }

                    $scope.parents = [];
                    $scope.selectedItem = null;
                    $scope.displayChildren = false;
                    $scope.drop = function() {
                        if ($scope.displayChildren) {
                            $scope.finishSelection();
                        } else {
                            if ($scope.selectedItem && $scope.items && $scope.items.length && typeof $scope.selectedItem.level !== "undefined") {
                                $scope.displayChildren = true;
                            } else {
                                loadItems().then(function() {
                                    $scope.displayChildren = true;
                                });
                            }
                        }
                    };

                    $scope.finishSelection = function () {
                        $scope.displayChildren = !$scope.displayChildren;
                    };

                    $scope.navigateUp = function () {
                        if (isHierarchical()) {
                            if ($scope.parents.length >= 1) {
                                var parent = $scope.parents[$scope.parents.length - 1];
                                $scope.parents.splice($scope.parents.length - 1, 1);
                                select(parent);
                            } else {
                                $scope.parents = [];
                                select(null);
                            }
                        }
                    };

                    function select(item) {
                        
                        $scope.selectedItem = item;
                        if (isHierarchical()) {
                            loadItems(item);
                        } else {
                            $scope.finishSelection();
                        }
                    }

                    $scope.select = function(item) {
                        if (isHierarchical() &&
                            $scope.selectedItem &&
                            typeof $scope.selectedItem.level !== "undefined" &&
                            $scope.selectedItem.level != item.level) {
                            $scope.parents.push($scope.selectedItem);
                        }
                        select(item);
                    };

                    function loadItems(parent) {
                        var result = $q.when({});
                        if ($scope.load) {
                            $scope.showSpinner = true;
                            result = $scope.load({ parent: parent });
                            if (result) {
                                result.then(function(items) {
                                    if (!items || items.length == 0 && $scope.selectedItem) {
                                        $scope.finishSelection();
                                    } else {
                                        $scope.items = _.map(items, function(item) {
                                            return _.extend(item, { level: parent ? parent.level + 1 : 0 });
                                        });
                                    }
                                }).then(function() {
                                    $scope.showSpinner = false;
                                    safeApply($scope);
                                });
                            }
                        }
                        return result;
                    }

                }
            ],
            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = function() {
                    scope.selectedItem = ngModel.$viewValue;
                    
                };

                scope.$watch("selectedItem", function(newValue, oldValue) {
                    if (scope.matchType &&
                        newValue &&
                        scope.matchType !== newValue.Type) {
                        
                        ngModel.$setValidity("selectList", false);
                    } else {
                        ngModel.$setValidity("selectList", true);
                        
                        ngModel.$setViewValue(newValue);
                    }
                });
            }
        };
    }];
})(Simple);