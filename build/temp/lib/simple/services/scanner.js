(function(S) {
    S.Scanner = ["$rootScope","$q", function($rootScope, $q) {

        function simulateScan(barCode) {
            acceptBarcode(barCode);
        }

        var scanner;
        if (typeof cordova !== "undefined") {
            scanner = cordova.require("cordova/plugin/BarcodeScanner");
        }

        function isScannerSupported() {
            return !!scanner;
        }
        
        function scan(context) {
            var result = $q.defer();

            if (isScannerSupported()) {
                scanner.scan(function(scanResult) {
                    if (scanResult.text && !scanResult.cancelled) {
                        acceptBarcode(scanResult.text, context);
                        result.resolve({ context: context, barcode: scanResult.text });
                    }
                });
            } else {
                result.reject("No scanner supported.");
            }

            return result.promise;
        }

        function acceptBarcode(barCode, context) {
            $rootScope.$broadcast("Simple.BarcodeScanned", { barCode: barCode, context: context });
        }


        return {
            simulate: simulateScan,
            scan: scan,
            isScannerSupported: isScannerSupported
        };
    }];
})(Simple);