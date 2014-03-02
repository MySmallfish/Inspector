(function (S) {

    S.PhoneGap = function () {
        
        return function(fn) {
            var queue = [];
            
            var impl = function() {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function() {
                _.each(queue, function (args) {
                    fn.apply(this, args);
                });
                impl = fn;
            }, false);

            return function() {
                return impl.apply(this, arguments);
            };
        };
    };

})(Simple);