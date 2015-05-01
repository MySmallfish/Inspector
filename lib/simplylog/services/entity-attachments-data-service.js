(function (S, SL) {

    SL.EntityAttachmentsDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        "entityUpdateProcessor",
        "simplyLogDatabase",
        function ($cacheFactory, $q, entityManager, simplyLogApiClient, entityUpdateProcessor, simplyLogDatabase) {

            function fetchAttachments() {
                var query = breeze.EntityQuery
                    .from("Attachment")
                    .where("EntityName", "==", "Event")
                    .where("RowStatus", "==", 0);

                var processor = entityUpdateProcessor.create(query, "Attachments");
                return processor.process();
            }

            function getAttachments(entityName, id) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.Attachments.where(["EntityName", "=", entityName]).where(["EntityId", "=", id]).select();
                });
            }

            function addAttachments(attachments) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.Attachments.max("Id").select().then(function(maxId) {
                        attachments = _.map(attachments, function () { return _.extend(att, { Id: maxId++ }); });
                        return db.Attachments.insert(attachments);
                    });
                });

            }

            function deleteAttachments(attachments) {
                return simplyLogDatabase.get().then(function(db) {
                    return db.Attachments.remove(_.map(attachments, function(id) { return { Id: id }; }));
                });
            }
            return {
                fetchAttachments: fetchAttachments,
                getAttachments: getAttachments,
                deleteAttachments: deleteAttachments,
                addAttachments: addAttachments
            };
        }
    ];

})(Simple, SimplyLog);

