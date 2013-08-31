(function(S){
	S.Scanner = function($rootScope){
        function simulateScan(barCode){
            acceptBarcode(barCode);
        }
        
        function acceptBarcode(barCode){
            $rootScope.$broadcast("Simple.BarcodeScanned", barCode);
        }
        
        function initialize(){
            
        }
        
        initialize();
        
        return {
            simulate: simulateScan
        };
	}
})(Simple);