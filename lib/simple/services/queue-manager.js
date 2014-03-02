(function (S) {
    // Add limits
    // Add send one time only
    // Add uniqueness (set - an item can only be added once)
    S.QueueManager = function ($q, storageService, $log) {
        var queues = {};

        function createQueue(options) {
            var queueName = "queue::" + options.name,
                pendingQueueName = queueName + "::" + "pending",
                processItemAction = options.processItemAction,
                inProcess, latestPush;

            function pushAction(item) {
                return function() {
                    return storageService.local(queueName).then(function(queueItems) {
                        $log.info("Queued Items:", queueItems);
                        queueItems = queueItems || [];

                        queueItems.push(item);

                        return queueItems;
                    }).then(function(queueItems) {
                        $log.info("Storing Queued Items:", queueItems);
                        return storageService.local(queueName, queueItems).then(function(items) {
                            return item;
                        });
                    });
                };
            }
            function push(item) {
                $log.info("Pushing item to queue (QueueName, Item). ", queueName, item);
                return pushAction(item)();
                //if (latestPush) {
                //    $log.info("Already have latest push");
                //    latestPush = latestPush.then(pushAction(item));
                //} else {
                    
                //    latestPush = pushAction(item)();
                //}

                //return latestPush;
            }

            function processQueue() {

                if (!inProcess) {
                    $log.info("Processing Queue:", queueName);
                    inProcess = true;
                    return storageService.local(pendingQueueName).then(function (items) {
                        $log.info("Queued Items:", items);
                        return $q.all(_.map(items, function (item) {
                            $log.info("Processing Item:", item);
                            return processItemAction(item);
                        }));
                    }).then(function () {
                        return storageService.local(pendingQueueName, null).then(function () {
                            inProcess = false;
                            return $q.when({});
                        });
                    });
                } else {
                    return $q.when({});
                }
            }
            function processPending(pending) {
                if (!pending || pending.length == 0) {
                    $log.info("Has no pending items");

                    var result = storageService.local(queueName).then(function (queueItems) {
                        return storageService.local(pendingQueueName, queueItems).then(function () {
                            return storageService.local(queueName, null).then(processQueue);
                        });
                    });
                    
                    return result;
                } else {
                    $log.info("Has pending items");
                    return processQueue().then(processAllItems);
                }
            }

            function processAllItems() {
                return storageService.local(pendingQueueName).then(processPending);
            }

            function run() {
                $log.info("Running Queue:", queueName);
                if (latestPush) {
                    latestPush = latestPush.then(processAllItems);
                } else {
                    latestPush = processAllItems();
                }
                return latestPush;
            }

            return {
                push: push,
                run: run
            };
        }
        return {
            get: function (options) {
                return queues[options.name] || createQueue(options);
            }
        };
    };
})(Simple);
