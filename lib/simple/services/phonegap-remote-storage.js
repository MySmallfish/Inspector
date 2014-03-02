(function(S) {
    S.PhoneGapRemoteStorage = function ($q, phoneGap) {
        function uploadFile(options) {
            var result = $q.defer();
            try {
                var fileTransfer = new FileTransfer(),
                    fileUploadOptions = new FileUploadOptions();
                fileUploadOptions.fileKey = "file";
                //fileUploadOptions.httpMethod = "PUT";
                fileUploadOptions.httpMethod = "POST";
                fileUploadOptions.mimeType = options.contentType || "image/jpeg";
                fileUploadOptions.fileName = options.fileName;
                fileUploadOptions.chunkedMode = false;
                fileUploadOptions.headers = options.sheaders;

                function onSuccess(args) {
                    console.log("Attachment uploaded successfully.", args);
                    result.resolve(args);
                }

                function onFailure(e) {
                    console.log("Attachment Upload Failure, error: ", e);
                    console.log("Attachment Upload Failed, error text: ", e.body);
                    result.reject(e);
                }

                console.log("Uploading Attachment: ", options);
                fileTransfer.upload(options.localUrl,options.remoteUrl, onSuccess, onFailure, fileUploadOptions, true);
            } catch (e) {
                console.log("Attachment Upload Exception caught, error: ", e);
            }
            return result.promise;
        }

        return {
            uploadFile: phoneGap(uploadFile)
        };
    };
})(Simple);