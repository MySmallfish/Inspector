(function(S, SL) {

    SL.EquipmentsManager = [
        "equipmentDataService",
        "simplyLogApiClient",
        function (equipmentDataService, simplyLogApiClient) {

            function find(barCode) {
                return simplyLogApiClient.findBarcode(barCode).then(function(e) {
                    return e;
                });
            }

            return {
                find: find
            };
        }
    ];

})(Simple,SimplyLog)