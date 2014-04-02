(function(S) {
    S.Scanner = function($rootScope) {

        function simulateScan(barCode) {
            acceptBarcode(barCode);
        }

        var scanner;
        if (typeof cordova !== "undefined") {
            scanner = cordova.require("cordova/plugin/BarcodeScanner");
        }

        function isScannerSupported() {
            return scanner;
        }
        
        function scan(context) {
            if (isScannerSupported()){
                scanner.scan(function (result) {
                    if (result.text && !result.cancelled) {
                        acceptBarcode(result.text, context);
                    }
                });
            }
        }

        function acceptBarcode(barCode,context) {
            $rootScope.$broadcast("Simple.BarcodeScanned", barCode, context);
        }


        return {
            simulate: simulateScan,
            scan: scan,
            isScannerSupported: isScannerSupported
        };
    };
})(Simple);