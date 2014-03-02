(function (S) {
    S.AttachmentsManager = function ($q, $rootScope, fileManager, fileUtils, queueManager, networkManager, remoteStorage, simplyLogApiClient, loginManager) {
        function processAttachment(uri) {
            var contentType = "image/jpeg",
                fileName = fileUtils.fileName(uri);
            
            console.log("Processing Attachment: ", uri);
            return simplyLogApiClient.addNewAttachment({
                url: uri,
                fileName: fileName,
                contentType: contentType
            }).then(function(item) {
                console.log("ANA", item);
                remoteStorage.uploadFile(item);
            });

        }

        var filesQueue = queueManager.get({
            name: "Attachments",
            processItemAction: processAttachment
        });

        function queue(uri) {
            console.log("QUEUED: ", uri);
            uri = uri.toURL();
            console.log("QUEUED.ToURL: ", uri);
            return filesQueue.push(uri).then(function (r) {
                console.log("AFTER TOOSH", r);
                //filesQueue.run();
                networkManager.runOnline(function () {
                    console.log("RUN OINline");
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
                console.log("FILE UIRI", fileUri);
                return fileManager.move(fileUri, "Attachments", fileUtils.uniqueFileName(fileUri));
            }).then(queue);
        }

        return {
            add: add
        };
    };
})(Simple);