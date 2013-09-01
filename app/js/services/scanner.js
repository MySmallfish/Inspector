(function(S) {
    S.Scanner = function($rootScope) {

        function simulateScan(barCode) {
            acceptBarcode(barCode);
        }

        function scan() {
            if (cordova) {
                var scanner = cordova.require("cordova/plugin/BarcodeScanner");
                scanner.scan(function (result) {
                    alert("Barcode:" + result.text);
                    acceptBarcode(result.text);
                });
            }
        }

        function acceptBarcode(barCode) {
            $rootScope.$broadcast("Simple.BarcodeScanned", barCode);
        }


        return {
            simulate: simulateScan,
            scan: scan
        };
    };
})(Simple);