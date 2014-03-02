(function(S) {

    S.EntityDescriptionFilter = function () {
        return function(entity) {
            return entity ? String(entity.Id) + " - " + entity.Name : "";
        };
    };

})(Simple);