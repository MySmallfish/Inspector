(function (S) {
    S.Utilities = function() {
        function decimalToHexString(number) {
            if (number < 0) {
                number = 0xFFFFFFFF + number + 1;
            }

            return number.toString(16).toUpperCase().substr(2);
        }
        return {
            os: {
                deviceType: function () {
                    var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
                    return deviceType;
                },
                isIOS: function () {
                    return ["iPad", "iPhone"].indexOf(this.deviceType()) >= 0;
                },
                isAndroid: function () {
                    return ["Android"].indexOf(this.deviceType()) >= 0;
                }
            },
            browser: {
                open: function (url, external) {
                    if ((new S.Utilities()).os.isIOS()) {
                        window.open(url, '_system');
                    } else {
                        window.open(url, '_blank', 'location=yes');
                    }

                }
            },
            color: {
                fromRGBValue: function (rgb) {
                    return "#" + decimalToHexString(rgb);
                    //return Math.abs(rgb).toString(16);
                },
                fromRGB: function (r, g, b) {
                    var rgb = b | (g << 8) | (r << 16);
                    return this.fromRGBValue(rgb);
                }
            },
            hash: function(s) {
                var hash = 0, i, char;
                if (s.length == 0) return hash;
                for (i = 0, l = s.length; i < l; i++) {
                    char = s.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            },
            guid: {
                create: function() {
                    var guid =
                    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                    return guid;
                }
            }
        };
    };
})(Simple);