(function (S) {
    S.AttachmentsDirectiveController = [
        "$scope", "attachmentsManager","camera", "safeApply", function($scope, attachmentsManager, camera, safeApply) {
            $scope.maxItems = parseInt($scope.maxItems, 10) || 3;
            function acceptAttachment(uri) {
                $scope.attachments.push({ Index: $scope.attachments.length, Url: uri });
                
                safeApply($scope);

                return uri;
            }

            function notifyAttachmentError(error) {
            }

            function deleteAttachment(attachment) {
                var index = _.indexOf($scope.attachments, attachment);

                if ($scope.attachments && $scope.attachments.length) {
                    $scope.attachments.splice(index, 1);
                }
            };

            function addFromCamera() {
                if (camera.isAvailable() && $scope.attachments) {
                    camera.takePicture().then(
                        function (uri) {
                            console.log("ADDING", uri);
                            return attachmentsManager.add(uri);
                        }).then(acceptAttachment, notifyAttachmentError);
                }
            };
            function addFromLibrary() {
                if (camera.isAvailable() && $scope.attachments) {
                    camera.takeFromLibrary().then(attachmentsManager.add).then(acceptAttachment, notifyAttachmentError);
                }
            };

            _.extend($scope, {
                addFromLibrary: addFromLibrary,
                addFromCamera: addFromCamera,
                deleteAttachment: deleteAttachment
            });
        }
    ];

    S.AttachmentsDirective = [
        function () {
            return {
                restrict: "E",
                scope: {
                    maxItems: "@",
                    attachments: "="
                },
                replace: true,
                templateUrl: "lib/simple/directives/attachments/attachments.html",
                controller: S.AttachmentsDirectiveController,
                link: function(scope, element, attrs) {
                    
                }
            };
        }
    ];
})(Simple);