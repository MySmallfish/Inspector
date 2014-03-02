(function (S) {
    S.FileUtils = function (utils) {
        function getFileName(uri) {
            var fileName = uri.substr(uri.lastIndexOf('/') + 1);
            fileName = fileName.replace(/\?*/gi, "");
            return fileName;
        }

        function uniqueFileName(uri) {
            var fileName = getFileName(uri);
            var name = fileName.substr(0, fileName.lastIndexOf('.'));
            var extension = fileName.substr(fileName.lastIndexOf('.') + 1);
            fileName = name + "-" + utils.guid.create() + "." + extension;
            return fileName;
        }

        function originalFileName(fileName) {
            var rx = /\b(.*)\.\-.*?\-(\..*)\b/;
            return fileName.replace(rx, "$1$2");
        }

        return {
            fileName: getFileName,
            uniqueFileName: uniqueFileName,
            originalFileName: originalFileName
        };
    };
})(Simple);