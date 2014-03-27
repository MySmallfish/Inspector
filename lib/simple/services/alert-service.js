(function (S) {
    S.AlertService = function($q, textResource, $rootScope, $modal) {

        function show(info) {
            
            var modalScope = $rootScope.$new();
            modalScope.title = info.title || textResource.get("AlertTitle") || "Message";
            modalScope.message = info.message;
            modalScope.confirmText = info.confirmText || textResource.get("AlertConfirm") || "Ok";
            if (info.confirmText) {
                modalScope.cancelText = info.cancelText || textResource.get("AlertCancel") || "Cancel";
            } else if (info.cancelText) {
              modalScope.confirmText = info.cancelText;
            }

            var result = $q.defer(), modal;

            modalScope.close = function (status) {
                if (!info.dontDismiss) {
                    modal.dismiss("hide");
                }
                
                result.resolve({ status: status ||  "Dismissed"  });
            };

            modalScope.confirm = function() {
                modalScope.close("Confirm");
            };

            modal = $modal.open({
                templateUrl: info.templateUrl || "views/alert.html",
                show: true,
                backdrop: typeof info.backdrop === "undefined" ? true : info.backdrop,
                scope: modalScope
            });

            return result.promise;
        }


        return {
            show: show
        };
    };
})(Simple);