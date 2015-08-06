(function (S) {
    S.AttachmentsManager = ["$q", "$rootScope", "fileManager", "fileUtils", "queueManager", "networkManager", "remoteStorage", "simplyLogApiClient", "loginManager", function ($q, $rootScope, fileManager, fileUtils, queueManager, networkManager, remoteStorage, simplyLogApiClient, loginManager) {
        function processAttachment(uri) {
            var contentType = "image/jpeg",
                fileName = fileUtils.fileName(uri);
           
            return simplyLogApiClient.addNewAttachment({
                url: uri,
                fileName: fileName,
                contentType: contentType
            }).then(function(item) {
                remoteStorage.uploadFile(item);
            });

        }

        var filesQueue = queueManager.get({
            name: "Attachments",
            processItemAction: processAttachment
        });

        function queue(uri) {
            uri = uri.toNativeURL();

            return filesQueue.push(uri).then(function (r) {
                networkManager.runOnline(function () {
                    filesQueue.run();
                });
                return r;
            });
        }

        function add(uri) {
            if (!uri) {
                throw new Error("'uri' must be specified.");
            }

            return $q.when(uri).then(function (fileUri) {
                return fileManager.move(fileUri, "Attachments", fileUtils.uniqueFileName(fileUri));
            }).then(queue);
        }

        return {
            add: add
        };
    }];
})(Simple);