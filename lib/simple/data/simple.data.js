(function(S) {
    var module = angular.module("Simple.Data", ["Simple"]);

    module.provider("dataBase", S.DatabaseServiceProvider);
})(Simple);