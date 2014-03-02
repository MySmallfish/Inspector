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
            function postEventSubAction(id, subActionName) {
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

            function sendActions(incidentActions) {
                return postEventSubAction(incidentActions.eventId, "Actions").then(makePostRequest(incidentActions.actions));
            }

            function sendChecklistItems(checklistItems) {
                return postEventSubAction(checklistItems.eventId, "ChecklistItems").then(makePostRequest(checklistItems.items));
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
                addNewAttachment: addNewAttachment
            };
        }
    ];
})(Simple, SimplyLog);
