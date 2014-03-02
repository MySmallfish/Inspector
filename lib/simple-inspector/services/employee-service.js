(function (S, I) {

    I.EmployeeService = function ($q) {
        return {
            getIdByCode: function(barCode) {
                return 2;
            },
            getById: function(id) {
                var result = $q.defer();
                result.resolve({ Id: id || 1, Name: "עובד חדש" });
                return result.promise;
            }
        };
    };

})(Simple, Simple.Inspector);
