(function (S) {

    S.BrowserDirective = [function () {

        return {
            restrict: 'E',
            templateUrl: 'lib/simplylog/directives/browser/browser.html',
            scope: {
                allItems: "=",
                confirmSelection: "&",
                selectedItem: "=",
                mandatory: "=",
                cannotConfirm: "=",
                autoSelectLeaf: "="
            },
            controller: S.BrowserDirectiveController
        }
    }];

})(Simple);