(function (S) {

    S.HierarchicalSelect = [function() {

        return {
            restrict: 'E',
            scope: {
                load: "&",
                selectedItem: "="
            },
            replace: true,
            templateUrl: "lib/simple/directives/hierarchical-select/hierarchical-select.html",
            controller: [
                "$scope",
                function ($scope) {
                    $scope.parents = [];
                    $scope.selectedItem = null;
                    $scope.displayChildren = false;
                    $scope.finishSelection = function() {
                        $scope.displayChildren = !$scope.displayChildren;
                    };

                    $scope.navigateUp = function () {
                        if ($scope.parents.length >= 1) {
                            var parent = $scope.parents[$scope.parents.length - 1];
                            $scope.parents.splice($scope.parents.length - 1, 1);
                            select(parent);
                        } else {
                            $scope.parents = [];
                            select(null);
                        }
                    };

                    function select(item) {
                        $scope.selectedItem = item;
                        loadItems(item);
                    }

                    $scope.select = function(item) {
                        if ($scope.selectedItem) {
                            $scope.parents.push($scope.selectedItem);
                        }
                        select(item);
                    };

                    function loadItems(parent) {
                        if ($scope.load) {
                            var result = $scope.load({ parent: parent });
                            if (result) {
                                result.then(function(items) {
                                    if (!items || items.length == 0 && $scope.selectedItem) {
                                        $scope.finishSelection();
                                    } else {
                                        $scope.items = items;
                                    }
                                });
                            }
                        }
                    }

                    loadItems();

                }
            ],
            link: function (scope, element, attrs, ctrl) {
                
            }
        };
    }];
})(Simple);