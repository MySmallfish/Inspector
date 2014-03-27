(function (S, I) {

    I.EmployeeService = function ($q, inspectorApi) {

        return {
            getEmployeeByCode: function (userId, barCode) {
                console.log("EmployeeService", userId, barCode);
                return inspectorApi.getEmployeeByCode(userId, barCode);
            },

            getById: function (employeeId) {
                return inspectorApi.getEmployeeById(employeeId);
            }
        };
    };

})(Simple, Simple.Inspector);
