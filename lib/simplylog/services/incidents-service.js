(function (S, SL) {
    SL.ActionTypes = {
        Comment: 0,
        Delegate: 1,
        StatusChange: 2,
        ChecklistItem: 3
    };

    SL.IncidentsService = function ($q, $cacheFactory, $log, utils, queueManager, incidentDataService) {
        var incidentsCache = $cacheFactory("incidents"),
            checklistsCache = $cacheFactory("checkLists"),
            locationTypes = ["SiteGeoGroup", "Site", "Building", "Cell"];

        function createMapIncident(actions) {
            return function (incident) {
                return mapIncident(incident, actions);
            };
        }
        function mapIncident(incident, actions) {
            var result = {
                Id: incident.Id,
                UniqueId: incident.Id,
                ParentEventId: incident.ParentEventId,
                Severity: {
                    Id: incident.Severity,
                    Name: incident.EventSeverityName,
                    Color: utils.color.fromRGBValue(incident.EventSeverityColor)
                },
                Description: incident.Description,
                DueTime: incident.DueTime,
                Status: incident.Status,
                StartTime: Date.parse(incident.StartTime),
                Index: incident.RunningIndex,
                Remarks: incident.Remarks,
                Category: {
                    Id: incident.CategoryId,
                    Name: incident.CategoryFullName
                },
                Location: {
                    Id: incident.LocationEntityId,
                    Type: locationTypes[incident.LocationEntityType],
                    Name: incident.LocationFullName,
                    Level0: incident.LocationLevel0,
                    Level1: incident.LocationLevel1
                },
                ChecklistId: incident.ChecklistId,
                Actions: actions || []
            };



            if (incident.EquipmentId) {
                result.Equipment = {
                    Id: parseInt(incident.EquipmentId, 10),
                    Name: incident.EquipmentName,
                    Type: {
                        Name: incident.EquipmentTypeName
                    }
                };
            }

            return result;
        }

        function mapIncidents(queryResults) {
            var incidents = queryResults;

            return _.map(incidents, mapIncident);
        }

        function getIncidentsFromServer(parameters) {
            return incidentDataService.getIncidents(parameters).then(mapIncidents);
        }

        function clearIncidentsCache() {
            incidentsCache.removeAll();
        }

        function getIncidents(parameters) {
            var paramsHash = parameters? utils.hash(JSON.stringify(parameters)) : "_";
            var cachedIncidents = incidentsCache.get(paramsHash);
            if (cachedIncidents) {
                return $q.when(cachedIncidents);
            } else {
                return getIncidentsFromServer(parameters).then(function(items) {
                    incidentsCache.put(paramsHash, items);
                    return items;
                });
            }
        }

        function getNewIncidentDetails() {
            var incidentDetails = {
                Id: 0,
                UniqueId: utils.guid.create(),
                StartTime: new Date()
            };

            var defer = $q.defer();
            defer.resolve(incidentDetails);
            return defer.promise;
        }

        function getIncidentActions(id, type) {
            return incidentDataService.getIncidentActions(id, type);
        }

        function mapActions(checklist) {
            return function (actions) {
                
                var map = _.groupBy(actions, "ChecklistItemId");

                function bindItem(item) {
                    
                    item.Value = "";

                    var action = _.first(map[item.Id]);

                    if (action) {
                        item.Checked = !!action.Checked;
                        if (_.isString(action.Description) && action.Description.indexOf(":") >= 0) {
                            var parts = (action.Description).split(":");
                            parts = _.last(parts, parts.length - 1);
                            item.Value = parts.length > 1 ? parts.join(":") : parts[0];
                        }
                        item.IsReadOnly = true;
                        item.Started = action.Started;
                    }
                }

                _.each(checklist.Items, bindItem);
                checklist.IsReadOnly = _.every(checklist.Items, function (item) { return item.IsReadOnly; });
                return checklist;
            };
        }

        function getChecklist(id, eventId) {

            function fetchItemsValues(checklist) {
                return getIncidentActions(eventId, [SL.ActionTypes.ChecklistItem]).then(mapActions(checklist));
            }

            var result = incidentDataService.getChecklist(id);
            if (eventId) {
                result = result.then(fetchItemsValues);
            }
            return result;
        }

        function getIncidentDetails(id) {
            return incidentDataService.getIncident(id).then(createMapIncident());
        }
        function sendUpdates() {
            return incidentsQueue.run().then(actionsQueue.run).then(checklistItemsQueue.run);
        }

        function mapChecklistItemsForSend(checklistItems) {
            var mapped = {
                eventId: checklistItems.eventId
            };

            function mapItem(item) {
                return {
                    Started: moment(item.Started).utc().toDate(),
                    Comment: item.Comment,
                    IsChecked: item.IsChecked,
                    ChecklistItemId: item.ChecklistItemId
                };
            }
            mapped.items = _.map(checklistItems.items, mapItem);

            return mapped;
        }
        function mapIncidentActionsForSend(incidentActions) {
            var mapped = {
                eventId: incidentActions.eventId
            };

            function mapAction(action) {
                return {
                    Started: moment(action.Started).utc().toDate(),
                    Description: action.Description,
                    IsOutsideReport: false
                };
            }
            mapped.actions = _.map(incidentActions.actions, mapAction);

            return mapped;
        }

        function mapIncidentForSend(incident) {
            var mapped = _.clone(incident);

            if (mapped.Id != 0) {
                mapped.OriginalId = mapped.Id;
                mapped.UniqueId = utils.guid.create();
            }


            if (mapped.ParentEventReferenceId === mapped.ParentEventId) {
                delete mapped.ParentEventId;
            }

            mapped.CategoryId = mapped.Category.Id;
            mapped.SeverityId = mapped.Severity.Id;

            if (mapped.Equipment) {
                mapped.EquipmentId = mapped.Equipment.Id;
            }

            if (mapped.HandlingTarget) {
                mapped.HandlingTargetId = parseInt(mapped.HandlingTarget.Id, 10);
            }

            delete mapped.Id;
            delete mapped.Category;
            delete mapped.Equipment;
            delete mapped.Severity;
            delete mapped.HandlingTarget;

            return mapped;
        }

        function sendActions(incidentActions) {
            $log.info("Sending incident actions... ", _.clone(incidentActions));
            if (incidentActions == null) {
                var d = $q.defer();
                d.reject("incidentActions is null");
                return d.promise;
            }

            incidentActions = mapIncidentActionsForSend(incidentActions);

            return incidentDataService.saveIncidentActions(incidentActions);

        }
        function sendChecklistItems(checklistItems) {
            checklistItems = _.clone(checklistItems);
            $log.info("Sending incident actions... ", checklistItems);
            if (checklistItems == null) {
                var d = $q.defer();
                d.reject("incidentActions is null");
                return d.promise;
            }
            checklistItems = mapChecklistItemsForSend(checklistItems);

            return incidentDataService.saveChecklistItems(checklistItems);

        }

        function sendIncident(incident) {
            $log.info("Sending incident... ", _.extend({}, incident));
            if (incident == null) {
                var d = $q.defer();
                d.reject("Incident is null");
                return d.promise;
            }

            incident = mapIncidentForSend(incident);

            return incidentDataService.saveIncident(incident);
        }

        function saveIncidentActions(incidentActions) {
            $q.when(incidentActions).then(actionsQueue.push)
                       .then(function () {
                           
                                actionsQueue.run();
                                return $q.when(incidentActions);
                            });
        }

        function saveChecklistItems(items) {
            $q.when(items).then(checklistItemsQueue.push)
                       .then(function () {
                           checklistItemsQueue.run();
                           return $q.when(items);
                       });
        }

        var checklistItemsQueue = queueManager.get({
            name: "ChecklistItems",
            processItemAction: sendChecklistItems
        });
        var actionsQueue = queueManager.get({
            name: "Actions",
            processItemAction: sendActions
        });
        var incidentsQueue = queueManager.get({
            name: "Incidents",
            processItemAction: sendIncident
        });

        function validate(incident) {
            var result = $q.defer();
            result.resolve(incident);
            return result.promise;
        }

        function pushIncidentToCache(incident) {
            var cachedIncidents = incidentsCache.get(incident.ParentEventId);
            if (!cachedIncidents) {
                cachedIncidents = [];
                incidentsCache.put(incident.ParentEventId, cachedIncidents);
            }

            var existingIncidentIndex = -1;
            _.each(cachedIncidents, function (i, index) {
                if (i.UniqueId == incident.UniqueId) {
                    existingIncidentIndex = index;
                }
            });

            if (existingIncidentIndex >= 0) {
                cachedIncidents.splice(existingIncidentIndex, 1);
            }

            cachedIncidents.push(incident);


            return incident;
        }

        function save(incident) {
            return validate(incident)
                            .then(incidentsQueue.push)
                            .then(pushIncidentToCache)
                            .then(function () {
                                incidentsQueue.run();
                                return $q.when(incident);
                            });
        }


        return {
            getIncidents: getIncidents,
            getIncidentDetails: getIncidentDetails,
            getIncidentActions: getIncidentActions,
            getNewIncidentDetails: getNewIncidentDetails,
            save: save,
            validate: validate,
            sendUpdates: sendUpdates,
            sendIncident: sendIncident,
            clearIncidentsCache: clearIncidentsCache,
            getChecklist: getChecklist,
            saveIncidentActions: saveIncidentActions,
            saveChecklistItems: saveChecklistItems
        };
    };

})(Simple, SimplyLog);

