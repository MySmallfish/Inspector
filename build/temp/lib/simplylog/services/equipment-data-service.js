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

            function getEquipmentBySerialNumber(serialNumber) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.Equipments.where(["SerialNumber", "=", serialNumber]).selectFirst();
                });
            }

            function getEquipmentTypesFromEquipments(parameters) {
                return simplyLogDatabase.get().then(function(db) {
                    var equipments = db.Equipments;
                    if (parameters && parameters.Location) {
                        //equipments.where(["LocationEntityId", "=", parameters.Location.Id], ["LocationEntityType", "=", parameters.Location.Type]);
                        equipments.where(["LocationPath", "=", parameters.Location.Path], ["LocationPath", "LIKE", parameters.Location.Path + "/%", "OR"]);
                    }
                    
                    return equipments.distinct().select("EquipmentTypeId", "EquipmentTypeName").then(function(items) {
                        return _.map(items, function(item) {
                            return {
                                Id: item.EquipmentTypeId,
                                Name: item.EquipmentTypeName
                            };
                        });
                    });
                });
            }

            function getEquipment(id) {
                return getEquipments({ Id: id }).then(function(results) {

                    return _.first(results);
                });
            }

            function getEquipments(parameters) {
                return simplyLogDatabase.get().then(function(db) {
                    var equipments = db.Equipments;
                    if (parameters) {
                        if (parameters.EquipmentTypeId) {
                            equipments.where(["EquipmentTypeId", "=", parameters.EquipmentTypeId]);
                        }
                        
                        if (parameters.Location) {
                            //equipments.where(["LocationEntityId", "=", parameters.Location.Id], ["LocationEntityType", "=", parameters.Location.Type]);
                            equipments.where(["LocationPath", "=", parameters.Location.Path], ["LocationPath", "LIKE", parameters.Location.Path + "/%", "OR"]);
                        }
                        if (parameters.Id) {
                            equipments.where(["Id", "=", parameters.Id]);
                        }
                    }

                    return equipments.select();
                });
            }

            function getEquipmentTypes(parameters) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.EquipmentTypes.select();
                });
            }

            function getEquipmentType(id) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.EquipmentTypes.where(["Id", "=", id]).selectFirst().then(function(equipmentType) {
                        //if (equipmentType.DefaultCategoryId) {
                        //    equipmentType.DefaultCategory = {
                        //        Id: equipmentType.DefaultCategoryId,
                        //        Name: equipmentType.DefaultCategoryName,
                        //        FullName: equipmentType.DefaultCategoryName,
                        //        Path: equipmentType.DefaultCategoryPath,
                        //        DefaultDescription: equipmentType.CategoryDefaultDescription
                        //    };

                        //    if (equipmentType.EventSeverityId) {
                        //        equipmentType.DefaultCategory.Severity = {
                        //            Id: equipmentType.EventSeverityId,
                        //            Name: equipmentType.EventSeverityName,
                        //            Color: equipmentType.EventSeverityColor
                        //        };
                        //    }

                        //}

                        return equipmentType;
                    });
                });
            }

            return {
                getEquipmentTypes: getEquipmentTypes,
                getEquipments: getEquipments,
                getEquipment: getEquipment,
                getEquipmentTypesFromEquipments: getEquipmentTypesFromEquipments,
                getEquipmentType: getEquipmentType,
                fetchEquipmentTypes: fetchEquipmentTypes,
                fetchEquipments: fetchEquipments,
                getEquipmentBySerialNumber: getEquipmentBySerialNumber
            };
        }
    ];

})(Simple, SimplyLog);
