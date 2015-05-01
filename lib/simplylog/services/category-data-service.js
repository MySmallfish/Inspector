(function (S, SL) {

    SL.CategoryDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        "entityUpdateProcessor",
        "simplyLogDatabase",
        function ($cacheFactory, $q, entityManager, simplyLogApiClient, entityUpdateProcessor, simplyLogDatabase) {
            function fetchCategories() {
                var query = breeze.EntityQuery
                    .from("Category");
                var processor = entityUpdateProcessor.create(query, "Categories");
                return processor.process();
            }

            function getCategories(parameters) {

                function queryCategories(db) {
                    var categories = db.Categories;


                    if (parameters) {
                        if (parameters.RootId) {
                            categories.where(["RootId", "=", parameters.RootId]);
                        }
                        if (parameters.ParentId) {
                            categories.where(["ParentId", "=", parameters.ParentId]);
                        } else if (parameters.RootOnly) {
                            categories.where(["ParentId", "IS", null]);
                        }

                        if (parameters.Path) {
                            categories.where(["Path", "=", parameters.Path], ["Path", "LIKE", parameters.Path + "/%", "OR"]);
                        }

                        if (parameters.Id) {
                            categories.where(["Id", "=", parameters.Id]);
                        }
                    }

                    return categories.select();
                }

                return simplyLogDatabase.get().then(queryCategories);

            }

            function getCategory(id) {
                return getCategories({ Id: id }).then(function(results) {
                    return _.first(results);
                });
            }

            return {
                getCategories: getCategories,
                getCategory: getCategory,
                fetchCategories: fetchCategories
            };
        }
    ];

})(Simple, SimplyLog);

