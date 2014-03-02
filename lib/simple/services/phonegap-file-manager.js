(function (S) {
    S.PhoneGapFileManager = function ($q, phoneGap, fileUtils) {
        function moveFile(sourceUri, directoryName, newFileName) {
            var result = $q.defer();

            getDirectory(directoryName).then(function (directory) {
                resolveFileUri(sourceUri).then(function(file) {
                    file.moveTo(directory,newFileName || file.name, result.resolve, result.reject);
                });
            }, result.reject);

            return result.promise;
        }
        function copyFile(sourceUri, directoryName, newFileName) {
            var result = $q.defer();

            getDirectory(directoryName).then(function (directory) {
                resolveFileUri(sourceUri).then(function(file) {
                    file.copyTo(directory, newFileName || file.name, result.resolve, result.reject);
                }, result.reject);
            }, result.reject);

            return result.promise;
        }

        function resolveFileUri(uri) {
            var result = $q.defer();
            window.resolveLocalFileSystemURI(uri, result.resolve, result.reject);
            return result.promise;
        }

        function callFileSystem() {
            var result = $q.defer();

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, result.resolve, result.reject);
            
            return result.promise;
        }

        function getDirectory(name) {
            var result = $q.defer();

            callFileSystem().then(function (fileSystem) {
                fileSystem.root.getDirectory(name, { create: true, exclusive: false }, result.resolve, result.reject);
            }, result.reject);
            return result.promise;
        }

        return {
            copy: phoneGap(copyFile),
            move: phoneGap(moveFile),
            getDirectory: phoneGap(getDirectory),
            resolve: phoneGap(resolveFileUri)
        };
    };
})(Simple);