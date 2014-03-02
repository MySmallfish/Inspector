(function (S, SL) {

    SL.EntityUpdateProcessor = [
        "$q", "entityManager", "simplyLogDatabase", function ($q, entityManager, simplyLogDatabase) {

            function EntityUpdateProcessor(query, entityName) {

                function fromDatabase() {
                    return simplyLogDatabase[entityName].select();
                }

                function queryServer(fetched) {
                    var lastUpdated = null;
                    if (fetched && fetched.length) {
                        lastUpdated = _.max(fetched, function (i) {
                            return i.Updated;
                        });
                    }


                    if (lastUpdated && lastUpdated.Updated) {
                        query = query.where("Updated", ">", moment(lastUpdated.Updated).utc().startOf("minute").toDate());
                    }

                    return entityManager.query(query).then(function (results) {

                        var items = _.map(results.results, function (r) { return _.clone(r); });

                        return {
                            local: fetched,
                            remote: items,
                            lastUpdated: lastUpdated
                        };
                    });
                }

                function split(items) {
                    var map = {};
                    _.each(items.local, function (i) {
                        i.Id = parseInt(i.Id, 10);
                        map[i.Id] = i;
                    });
                    var partitioned = _.partition(items.remote, function (item) {
                        item.Id = parseInt(item.Id, 10);
                        return typeof map[item.Id] === "undefined";
                    });

                    var updates = _.partition(partitioned[1], function (item) {
                        return typeof item.RowStatus === "undefined" || item.RowStatus == 0;
                    });

                    return {
                        lastUpdated: items.lastUpdated,
                        itemsToInsert: partitioned[0],
                        itemsToDelete: updates[1],
                        itemsToUpdate: updates[0],
                        items: _.union(items.local, items.remote)
                    };
                }

                function executeDelete(items) {
                    return simplyLogDatabase[entityName].remove(items);
                }

                function executeInsert(items) {
                    return simplyLogDatabase[entityName].insert(items);
                }

                function executeUpdate(items) {
                    return simplyLogDatabase[entityName].update(items);
                }

                function execute(payload) {
                    return $q.all([
                        $q.when(payload.itemsToDelete).then(executeDelete),
                        $q.when(payload.itemsToInsert).then(executeInsert),
                        $q.when(payload.itemsToUpdate).then(executeUpdate)
                    ]).then(function () { return simplyLogDatabase[entityName].select(); });
                }

                return {
                    process: function () {
                        return fromDatabase().then(queryServer).then(split).then(execute);
                    }
                };

            }

            function create(query, entityName) {
                return new EntityUpdateProcessor(query, entityName);
            }

            return {
                create: create
            };
        }
    ];
})(Simple, SimplyLog)
