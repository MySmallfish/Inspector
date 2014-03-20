(function (S) {

    S.ScanBarcodeDirective = ["$rootScope", "scanner", function ($rootScope, scanner) {
        return {
            restrict: 'E',
            templateUrl: 'lib/simple/directives/scan-barcode/scan-barcode.html',
            scope: {
                barcode: "=",
                barcodeScanned: "&",
                disabled: "="
            },
            replace:true,
            link: function (scope, element, attrs, ngModel) {
                function acceptBarcode() {
                    if (scanner.isScannerSupported()) {
                        scanner.scan(attrs.id);
                    } else {
                        scanner.simulate($(".barcode-text", element).val());
                    }
                }

                function clearBarcode() {
                    scope.barcode = "";
                }

                $rootScope.$on("Simple.BarcodeScanned", function (eventInfo, barCode) {
                    scope.barcode = barCode;
                    scope.barcodeScanned({ barCode: barCode });
                    scope.$apply();
                });

                scope.clear = clearBarcode;

                $(".barcode-text", element).keyup(function (event) {
                    if (event.keyCode === 13) {
                        acceptBarcode();
                        event.preventDefault();
                    } else if (event.keyCode === 27) {
                        clearBarcode();
                        scope.$apply();
                    }
                });
                
                $(".scan", element).click(acceptBarcode);
            }
        };
    }];

})(Simple);