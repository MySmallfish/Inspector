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
                var categories = simplyLogDatabase.Categories;

                if (parameters) {
                    if (parameters.RootId) {
                        categories.where([ "RootId", "=", parameters.RootId]);
                    }
                    if (parameters.ParentId) {
                        categories.where(["ParentId", "=", parameters.ParentId]);
                    }
                }

                return categories.select();
            }

            return {
                getCategories: getCategories,
                fetchCategories: fetchCategories
            };
        }
    ];

})(Simple, SimplyLog);

