(function (S) {

    S.ListDirective = [function () {

        return {
            restrict: 'E',
            scope: {
                load: "&",
                shouldReload: "=",
                small:"@",
                root: "@",
                text: "@",
                path: "=",
                finalSelection: "=",
                ngModel: "=",
                isHierarchical: "@",
                groupping: "@",
                useColorHint: "@",
                matchType: "@",
                id: "@",
                isLoading: "="
            },
            require: "^ngModel",
            replace: true,
            templateUrl: "lib/simple/directives/list/list.html",
            controller: [
                "$scope",
                "$q",
                "$modal",
                "safeApply",
                function ($scope, $q, $modal, safeApply) {
                    function isHierarchical() {
                        return $scope.isHierarchical == "true";
                    }

                    $scope.$watch("shouldReload", function (newValue) {
                        if (newValue) {
                            loadItems();
                            $scope.shouldReload = false;
                        }
                    });

                    $scope.root = $scope.root || "..";
                    $scope.parents = [];
                    $scope.selectedItem = null;

                    $scope.reload = function () {
                        $scope.finalSelection = false;
                        loadItems();
                    };


                    $scope.finishSelection = function () {
                        $scope.finalSelection = true;
                        $scope.$root.$broadcast("Simple.List.SelectionCommited");
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

                    $scope.isSelected = function isSelected(item) {
                        return !!$scope.selectedItem && $scope.selectedItem === item;
                    };

                    function select(item) {

                        $scope.selectedItem = item;
                        if (isHierarchical()) {
                            loadItems(item);
                        } else {
                            $scope.finishSelection();
                        }
                    }

                    $scope.select = function (item, $event) {
                        $event.preventDefault();
                        $scope.search = "";
                        if (isHierarchical()) {
                            if (!!$scope.selectedItem &&
                                typeof $scope.selectedItem.level !== "undefined" &&
                                $scope.selectedItem.level != item.level) {
                                $scope.parents.push($scope.selectedItem);
                            } else {
                                $scope.parents = [];
                            }
                            $scope.path = _.reduce($scope.parents, function(a, b) {
                                return a + b[$scope.text || "Text"] + " - ";
                            }, "");

                        }
                        
                        select(item);
                    };

                    function loadItems(parent) {
                        var result = $q.when({});

                        if ($scope.load) {
                            $scope.isLoading = true;
                            result = $scope.load({ parent: parent });

                            if (result) {
                                result.then(function (items) {
                                    if ((!items || items.length == 0) && !!$scope.selectedItem) {
                                        $scope.finishSelection();
                                    } else {
                                        $scope.items = _.map(items, function (item) {
                                            var mapped = _.extend(item, { level: parent ? parent.level + 1 : 0 });
                                            return mapped;

                                        });
                                    }
                                }).then(function () {
                                    $scope.isLoading = false;
                                    safeApply($scope);
                                });
                            }
                        }
                        return result;
                    }

                }
            ],
            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = function () {
                    scope.selectedItem = ngModel.$viewValue;

                };

                scope.$watch("selectedItem", function (newValue, oldValue) {
                    
                    if (newValue) {
                        if (scope.matchType && scope.matchType !== newValue.Type) {
                            ngModel.$setValidity("selectList", false);
                        } else {
                            
                            ngModel.$setValidity("selectList", true);
                            ngModel.$setViewValue(newValue);
                        }

                    } else {

                        scope.reload();

                    }
                });
            }
        };
    }];
})(Simple);