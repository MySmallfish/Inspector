(function (S, SL) {

    SL.IncidentDataService = [
        "$cacheFactory",
        "$q",
        "entityManager",
        "simplyLogApiClient",
        "simplyLogDatabase",
        "entityUpdateProcessor",
        function ($cacheFactory, $q, entityManager, simplyLogApiClient, simplyLogDatabase, entityUpdateProcessor) {

            var referenceCache = $cacheFactory("reference");

            function getEventsQuery() {
                return breeze.EntityQuery.from("Event");
            }

            function getActiveItemsQuery(entity, fields, orderBy) {
                var query = breeze.EntityQuery.from(entity)
                    .where("RowStatus", "==", 0);

                if (fields) {
                    query = query.select(fields);
                }

                if (orderBy) {
                    query = query.orderBy(orderBy);
                }

                return query;
            }

            function getSeverityQuery() {
                var query = getActiveItemsQuery("Severity", ["Id", "Name", "Color", "Updated", "RowStatus"], "Id").where("Id", "<", 4);
                return query;
            }

            function getHandlingTargetQuery() {
                var query = getActiveItemsQuery("HandlingTarget", ["Id", "Name"], "Name");
                return query;
            }

            function getItems(query, mapFunction, cacheKey) {
                var cached = referenceCache.get(cacheKey);
                if (cached) {
                    return $q.when(cached);
                } else {
                    return entityManager.get().then(function(em) {
                        return $q.when(em.executeQuery(query));
                    }).then(function(result) {
                        var items = _.map(result.results, mapFunction);
                        referenceCache.put(cacheKey, items);
                        return items;
                    });
                }
            }

            function getSeverity(id) {
                return getItem("severities", function(severity) {
                    return severity.Id == id;
                });
            }

            function getHandlingTarget(id) {
                return getItem("handlingTargets", function(handlingTarget) {
                    return handlingTarget.Id == id;
                });
            }

            function getItem(cacheKey, predicate) {
                var cached = referenceCache.get(cacheKey), item;

                if (cached) {
                    item = _.find(cached, predicate);
                }
                return item;
            }

            function mapSeverity(severity) {
                severity.Id = parseInt(severity.Id, 10);
                return {
                    Id: severity.Id,
                    Name: severity.Name,
                    Color: severity.Color
                };
            }

            function mapHandlingTarget(handlingTarget) {
                return {
                    Id: handlingTarget.Id,
                    Name: handlingTarget.Name

                };
            }

            function fetchSeverities() {
                var processor = entityUpdateProcessor.create(getSeverityQuery(), "EventSeverities");
                return processor.process();
            }

            function getHandlingTargets() {
                return getItems(getHandlingTargetQuery(), mapHandlingTarget, "handlingTargets");
            }


            function getSeverities() {
                return getItems(getSeverityQuery(), mapSeverity, "severities");
            }

            function getIncident(id) {
                return simplyLogDatabase.Events.where(["Id", "=", id]).selectFirst();
                //return entityManager.getByKey("Event", id, true).then(function (incident) {
                //    return incident.entity;
                //});
            }

            function getByKey(entityName, id) {
                return entityManager.getByKey(entityName, id, true).then(function(entity) {
                    return entity.entity;
                });
            }

            function getChecklist(id) {
                function fetchChecklistItems(checklist) {
                    return simplyLogApiClient.getChecklistItems(id).then(function(items) {
                        return _.extend(checklist, {
                            Items: items
                        });
                    });;
                }


                return getByKey("Checklist", id)
                    .then(fetchChecklistItems)
                    .then(sortChecklistItems);
            }


            function sortActions(actions) {
                return _.sortBy(actions, "Started").reverse();
            }

            function sortChecklistItems(checklist) {
                checklist.Items = _.sortBy(checklist.Items, "SortOrder");
                return checklist;
            }


            function getIncidentActions(id, type) {
                return simplyLogApiClient.getEventActions(id).then(function(actions) {
                    actions = _.map(actions, function(action) {
                        action.Started = moment(action.Started).toDate();
                        return action;
                    });
                    return actions;
                }).then(sortActions);
            }


        


            function getIncidents(parameters) {
                var query = getEventsQuery().where("RowStatus", "==", 0);

                if (parameters) {
                    _.each(parameters, function (parameterValue, parameterName) {
                        query = query.where(parameterName, "==", parameterValue);
                    });

                }

                query = query.orderByDesc("StartTime");

                var processor = entityUpdateProcessor.create(query, "Events");
                return processor.process();
            }

            function saveChecklistItems(checklistItems) {
                var result = simplyLogApiClient.sendChecklistItems(checklistItems);

                return result;
            }

            function saveIncidentActions(incidentActions) {
                var result = simplyLogApiClient.sendActions(incidentActions);

                return result;

            }
            function saveIncident(incident) {
                var result = simplyLogApiClient.getIncidentResource().then(function (incidentResource) {
                    if (incident.Id) {
                        return incidentResource.update(incident);
                    } else {
                        return incidentResource.create(incident);
                    }

                });

                return result;
            }

            return {
                getIncidents: getIncidents,
                getHandlingTargets: getHandlingTargets,
                getSeverities: getSeverities,
                fetchSeverities: fetchSeverities,
                getSeverity: getSeverity,
                getHandlingTarget: getHandlingTarget,
                saveIncident: saveIncident,
                getIncident: getIncident,
                getIncidentActions: getIncidentActions,
                getChecklist: getChecklist,
                saveIncidentActions: saveIncidentActions,
                saveChecklistItems: saveChecklistItems
            };

        }
    ];

})(Simple, SimplyLog);
