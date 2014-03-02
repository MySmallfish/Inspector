(function (S, SL) {

    SL.EquipmentDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "entityUpdateProcessor",
        "simplyLogDatabase",
        function ($cacheFactory, $q, entityManager, entityUpdateProcessor, simplyLogDatabase) {
            
            function getActiveItemsQuery(entity) {
                var query = breeze.EntityQuery.from(entity)
                                .where("RowStatus", "==", 0);
                return query;
            }

            function fetchEquipmentTypes() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("EquipmentType"), "EquipmentTypes");
                return processor.process();
            }

            function fetchEquipments() {
                var processor = entityUpdateProcessor.create(getActiveItemsQuery("Equipment"), "Equipments");
                return processor.process();
            }

            function getEquipments(parameters) {
                var equipments = simplyLogDatabase.Equipments;
                if (parameters && parameters.EquipmentTypeId) {
                    equipments.where(["EquipmentTypeId", "=", parameters.EquipmentTypeId]);
                }

                return equipments.select();
            }

            function getEquipmentTypes(parameters) {
                return simplyLogDatabase.EquipmentTypes.select();
            }


            return {
                getEquipmentTypes: getEquipmentTypes,
                getEquipments: getEquipments,
                fetchEquipmentTypes: fetchEquipmentTypes,
                fetchEquipments: fetchEquipments

            };
        }
    ];

})(Simple, SimplyLog);
