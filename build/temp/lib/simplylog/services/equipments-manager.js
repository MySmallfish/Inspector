(function (S, SL) {

    SL.EquipmentsManager = [
        "equipmentDataService",
        "simplyLogApiClient",
        function (equipmentDataService, simplyLogApiClient) {

            function find(barCode) {
                return equipmentDataService.getEquipmentBySerialNumber(barCode).then(function (equipment) {
                    if (equipment) {
                        equipment.Location = {
                            Id: equipment.LocationEntityId,
                            Name: equipment.LocationFullName,
                            FullName: equipment.LocationFullName,
                            Path: equipment.LocationPath,
                            EntityName: SL.LocationTypes[equipment.LocationEntityType]
                        };
                        delete equipment.LocationEntityId;
                        delete equipment.LocationFullName;
                        delete equipment.LocationPath;
                    }
                    return {
                        Equipment: equipment
                    };
                });
                //return simplyLogApiClient.findBarcode(barCode).then(function(e) {
                //    return e;
                //});
            }

            return {
                find: find
            };
        }
    ];

})(Simple, SimplyLog)