(function (S) {
    S.NullCameraService = function ($q) {

        function isAvailable() {
            return false;
        }

        function capture(options) {
            var defer = $q.defer();
            defer.reject({
                message: "Available only on supported devices."
             });
            return defer.promise;
        }

        function takePicture(options) {
            return capture(options);
        }

        function takeFromLibrary() {
            return capture(options);
        }

        return {
            isAvailable: isAvailable,
            takePicture: takePicture,
            takeFromLibrary: takeFromLibrary
        };

    };
})(Simple);