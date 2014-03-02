(function(S) {
    S.PhoneGapCameraService = function($q,phoneGap) {

        function isAvailable() {
            return  navigator.camera;
        }

        function capture(options) {
            
            var defer = $q.defer();
            if (isAvailable()) {
                options = _.defaults(options || {}, {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    saveToPhotoAlbum: false,
                    correctOrientation: true,
                    targetWidth: 1024,
                    targetHeight: 768
                });

                navigator.camera.getPicture(function (imageUri) {
                    defer.resolve(imageUri);
                }, function (error) {
                    defer.reject(error);
                }, options);
                
                
            } else {
                defer.reject({ message: "Camera not available" });
            }
            return defer.promise;
        }

        function takePicture(options) {
            options = _.defaults(options|| {},{ saveToPhotoAlbum: true });
            if (isAvailable()) {
                options.sourceType = Camera.PictureSourceType.CAMERA;
            }
            return capture(options);
        }

        function takeFromLibrary(options) {
            options = options || {};
            if (isAvailable()) {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            }
            return capture(options);
        }

        return {
            isAvailable: isAvailable,
            takePicture: phoneGap(takePicture),
            takeFromLibrary: phoneGap(takeFromLibrary)
        };

    };
})(Simple);