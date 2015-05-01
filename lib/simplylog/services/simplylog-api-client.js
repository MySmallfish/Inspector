(function (S, SL) {
    SL.ApiClient = [
        "$resource",
        "configurationManager",
        "loginManager",
        "$http",
        "$q",
        function ($resource, configurationManager, loginManager, $http, $q) {

            function run(api, apiArea) {
                var url = configurationManager.get("Api.Address");
                var result = loginManager.getAccessToken().then(function (token) {
                    return {
                        url: url + "/" + (apiArea ? apiArea : "api") + "/" + api,
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    };
                });

                return result;
            }
            function makeGetRequest() {
                return function(info) {
                    return makeHttpRequest(info, "GET");
                };
            }
            function makePostRequest(data) {
                return function (info) {
                    return makeHttpRequest(info, "POST", data);
                };
            }
            function makeHttpRequest(info, method, data) {
                return $http({ url: info.url, headers: info.headers, method: method || "GET", data: data });
            }

            function buildODataPath(entityName, subEntityName, id) {
                return $q.when(entityName + "(" + id + ")/" + subEntityName);
            }

            function runOData(path) {
                return run(path, "odata");
            }
            function extractData(results) {
                return results ? results.data : null;
            }
            function extractODataValue(results) {
                return results && results.data ? results.data.value : null;
            }

            function getSubEntities(entityName, subEntityName, id) {
                return buildODataPath(entityName, subEntityName, id)
                        .then(runOData)
                        .then(makeHttpRequest)
                        .then(extractODataValue);
            }

            function getEventActions(id) {
                return getSubEntities("Event", "Actions", id);
            }
            function getChecklistItems(id) {
                return getSubEntities("Checklist", "Items", id);
            }
            function runEventSubAction(id, subActionName) {
                return run("Events").then(function(info) {
                    info.url += "/" + id + "/" + subActionName;
                    return info;
                });
            }

            function addNewAttachment(parameters) {
                return run("Attachments").then(function (info) {
                    var result = {
                        remoteUrl: info.url,
                        localUrl: parameters.url,
                        fileName: parameters.fileName,
                        contentType: parameters.contentType,
                        headers: info.headers
                    };
                    return result;
                });
            }

            function openIncident(incidentId) {
                return runEventSubAction(incidentId, "Open").then(makePostRequest());
            }

            function closeIncident(incidentId) {
                return runEventSubAction(incidentId, "Close").then(makePostRequest());
            }

            function queryCanCloseIncident(incidentId) {
                return runEventSubAction(incidentId, "CanClose").then(makeGetRequest()).then(extractData);
            }

            function delegateTreatment(incidentId, info) {
                return runEventSubAction(incidentId, "Delegate").then(makePostRequest(info));
            }

            function updateAttachments(id, attachments, deletedAttachmentIds) {
                return runEventSubAction(id, "Attach").then(makePostRequest({ Attachments: attachments, DeletedAttachments: deletedAttachmentIds }));
            }

            function sendActions(incidentActions) {
                return runEventSubAction(incidentActions.eventId, "Actions").then(makePostRequest(incidentActions.actions));
            }

            function sendChecklistItems(checklistItems) {
                return runEventSubAction(checklistItems.eventId, "ChecklistItems").then(makePostRequest(checklistItems.items));
            }

            function createResource(name) {
                return run(name).then(function (info) {
                    var resource =
                         $resource(info.url, {}, {
                             update: {
                                 method: "PUT",
                                 headers: _.clone(info.headers)
                             },
                             create: {
                                 method: "POST",
                                 headers: _.clone(info.headers)
                             }
                         });
                    return resource;

                });

            }

            function getIncidentResource() {
                return createResource("Events");
            }

            function getEquipmentResource() {
                return createResource("Equipment");
            }

            function findBarcode(barCode) {
                return run("BarCode").then(function (info) {
                    return $http({
                        url: info.url,
                        headers: _.extend({}, info.headers),
                        method: "GET",
                        params: { barCode: barCode }
                    });
                }).then(function (results) {

                    return results.data;
                });
            }

            return {
                getIncidentResource: getIncidentResource,
                getEquipmentResource: getEquipmentResource,
                findBarcode: findBarcode,
                getEventActions: getEventActions,
                getChecklistItems: getChecklistItems,
                sendActions: sendActions,
                sendChecklistItems: sendChecklistItems,
                addNewAttachment: addNewAttachment,
                delegateTreatment: delegateTreatment,
                queryCanCloseIncident: queryCanCloseIncident,
                openIncident: openIncident,
                closeIncident: closeIncident,
                updateAttachments: updateAttachments
            };
        }
    ];
})(Simple, SimplyLog);
