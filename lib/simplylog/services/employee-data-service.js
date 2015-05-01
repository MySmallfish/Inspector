(function (S, SL) {

    SL.EmployeeDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        "entityUpdateProcessor",
        "simplyLogDatabase",
        function($cacheFactory, $q, entityManager, simplyLogApiClient, entityUpdateProcessor, simplyLogDatabase) {
            
            function queryEmployees(db) {
                return db.Employees.where(["ContactTypeId", "!=", 0]).select("Id", "FullName");
            }
            function getEmployeeNames() {
                return simplyLogDatabase.get().then(queryEmployees);
            }

            function fetchEmployees() {
                var query = breeze.EntityQuery.from("Employee");
                var processor = entityUpdateProcessor.create(query, "Employees");
                return processor.process();
            }

            return {
                fetchEmployees: fetchEmployees,
                getEmployeeNames: getEmployeeNames
            };

        }
    ];

})(Simple, SimplyLog);
