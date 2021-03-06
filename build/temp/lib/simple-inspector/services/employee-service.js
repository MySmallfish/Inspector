﻿(function (S, I) {

    I.EmployeeService = ["$q", "inspectorApi", function ($q, inspectorApi) {

        return {
            getEmployeeByCode: function (userId, barCode) {
                return inspectorApi.getEmployeeByCode(userId, barCode);
            },

            getById: function (employeeId) {
                return inspectorApi.getEmployeeById(employeeId);
            }
        };
    }];

})(Simple, Simple.Inspector);
