(function (S, SL) {

    S.BrowserDirectiveController = [
        "$scope", "safeApply", 
        function ($scope, safeApply) {
           
            $scope.clearSelection = function () {
                $scope.selectedItem = null;
                $scope.selectedItemParts = [];
                $scope.searchResults = [];
                $scope.items = _.filter($scope.allItems, function (anItem) { return !anItem.ParentId; });
            };
            $scope.$watch("allItems", function(items) {
                $scope.hideSelectionConfirm = $scope.autoSelectLeaf && _.all(items, function(item) {
                    return !item.HasChildren;
                });
                $scope.clearSelection();
            });
            
            $scope.searchResults = [];
            var search = _.throttle(function (searchTerm) {
                $scope.searchResults = _.map(_.filter($scope.allItems, function (item) {

                    return item.Text.indexOf(searchTerm) >= 0;
                }), function (item) {
                    return _.extend(item, { IsSearchResult: true, Parts: (item && item.FullName) ? item.FullName.split("-") : [item.Text] });
                });
                safeApply($scope);
            }, 500, { leading: false });

            $scope.$watch("searchTerm", function (searchTerm) {
                if (searchTerm) {
                    search(searchTerm);
                } else {
                    $scope.clearSelection();
                }
            });

            $scope.$watch("selectedItem", function(item) {
                if (item) {
                    if (item.HasChildren) {
                        expandItem(item);
                    } else {
                        if ((item.IsSearchResult || $scope.autoSelectLeaf) && !$scope.cannotConfirm) {
                            $scope.confirmSelection();
                        }
                    }
                }
            });
            
            function selectItem(item) {
                $scope.selectedItemParts = (item && item.FullName ? item.FullName.split(",") : [item.Text]);
                $scope.selectedItem = item;

            }

            function expandItem(item) {
                $scope.selectedItemParent = item;

                $scope.items = _.filter($scope.allItems, function (anItem) { return anItem.ParentId == item.Id && (!anItem.ParentEntityName || anItem.ParentEntityName == item.EntityName); });
            }

            $scope.select = function (item) {
                selectItem(item);
                
            };




        }
    ];

})(Simple, SimplyLog);

