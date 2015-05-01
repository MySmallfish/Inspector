module.exports = function (grunt) {
    var pkg = grunt.file.readJSON("package.json"),
        path = require("path");
    grunt.initConfig({
        pkg: pkg,
        bumpup: 'package.json',
        concat: {
            css: {
                src: [
    "temp/lib/bootstrap/css/bootstrap.min.css",
    "temp/lib/bootstrap-rtl/css/bootstrap-rtl.css",
    "temp/lib/font-awesome/css/font-awesome.min.css",
    "temp/lib/simple/css/select-box.css",
    "temp/app/common/directives/numpad/numpad.css",
    "temp/app/common/directives/app-header/app-header.css",
    "temp/lib/simple/directives/scan-barcode/scan-barcode.css",
                    "temp/app.min.css"
                ],
                dest: "temp/output/app/css/app.min.css"
            },
            js: {
                src: [
     "temp/lib/underscore/underscore.1.6.0.min.js",
     "temp/lib/moment/moment.min.js",
     "temp/lib/jquery/jquery-2.1.0.min.js",
     "temp/lib/bootstrap/js/bootstrap.min.js",
     "temp/lib/angular/angular.js",
     "temp/lib/angular/angular-resource.js",
     "temp/lib/angular/angular-route.js",
     "temp/lib/angular/angular-touch.js",
     "temp/lib/simple/simple.js",
    "temp/lib/simple/services/utils.js",
    "temp/lib/simple/services/logger-provider.js",
    "temp/lib/simple/services/file-utils.js",
    "temp/lib/simple/services/attachments-manager.js",
    "temp/lib/simple/services/phonegap.js",
    "temp/lib/simple/services/null-camera-service.js",
    "temp/lib/simple/services/phonegap-camera-service.js",
    "temp/lib/simple/services/phonegap-remote-storage.js",
    "temp/lib/simple/services/phonegap-file-manager.js",
    "temp/lib/simple/services/queue-manager.js",
    "temp/lib/simple/services/state-manager.js",
    "temp/lib/simple/services/scanner.js",
    "temp/lib/simple/services/flashlight.js",
    "temp/lib/simple/services/geo-location.js",
    "temp/lib/simple/services/storage-service.js",
    "temp/lib/simple/services/language.js",
    "temp/lib/simple/services/text-resources.js",
    "temp/lib/simple/services/safe-apply.js",
    "temp/lib/simple/services/network-service.js",
    "temp/lib/simple/services/network-manager.js",
    "temp/lib/simple/services/configuration.js",
    "temp/lib/simple/services/azure-active-directory.js",
    "temp/lib/simple/services/login-manager.js",
    "temp/lib/simple/services/entity-manager.js",
    "temp/lib/simple/services/alert-service.js",
    "temp/lib/simple/services/simplylog-client.js",
    "temp/lib/simple/data/database-service.js",
    "temp/lib/simple/data/simple.data.js",
    "temp/lib/simple/filters/localize.js",
    "temp/lib/simple/filters/gps-location.js",
    "temp/lib/simple/filters/entity-description.js",
    "temp/lib/simple/directives/simple-nav.js",
    "temp/lib/simple/directives/hierarchical-select/hierarchical-select.js",
    "temp/lib/simple/directives/select/select.js",
    "temp/lib/simple/directives/list/list.js",
    "temp/lib/simple/directives/scan-barcode/scan-barcode.js",
    "temp/lib/simple/directives/attachments/attachments.js",
    "temp/lib/simple/directives/wizard/wizard.js",

    "temp/lib/simple/simple-module.js",
     "temp/lib/simple-inspector/inspector.js",
     "temp/lib/simple-inspector/services/site-service.js",
     "temp/lib/simple-inspector/services/event-report-manager.js",
     "temp/lib/simple-inspector/services/employee-service.js",
     "temp/lib/simple-inspector/services/time-report-manager.js",
     "temp/lib/simple-inspector/inspector-module.js",
     "temp/lib/simple-inspector/services/inspector-api.js",
     "temp/lib/simple-inspector/services/configuration.js",
     "temp/app/common/services/login-manager.js",
     "temp/app/common/directives/numpad/numpad.js",
     "temp/app/common/directives/app-header/app-header.js",
     "temp/app/common/controllers/app.js",
     "temp/app/common/controllers/login.js",
     "temp/app/common/controllers/register-phone-number.js",
     "temp/app/common/controllers/home.js",
     "temp/app/time-reports/controllers/report.js",
     "temp/app/time-reports/controllers/manual-report.js",
     "temp/app/time-reports/controllers/time-reports.js",
     "temp/app/manager/controllers/manager-report.js",
     "temp/app/manager/controllers/event-time-reports.js",
     "temp/app/common/app.js",
     "temp/app/common/routes.js",
     "temp/app/common/resources.js"
                ],
                dest: "temp/output/app/js/app.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            build: {
                src: [
                    "temp/output/app/js/app.js"
                ],
                dest: "temp/output/app/js/app.min.js"
            }
        },
        jade: {
            compile: {
                options: {
                    data: {
                        version: pkg.version
                    }
                },
                files: [
                    {
                        src: ['temp/app/index.jade'],
                        dest: 'temp/output/index.html',
                        ext: '.html'
                    }
                ]
            }
        },
        copy: {
            build: {
                cwd: '..',
                src: ['app/**', 'lib/**', 'views/**'],
                dest: 'temp',
                expand: true
            },
            html: {
                cwd: "temp",
                src: ["views/**", "app/img/**", "app/common/img/**", "app/**/*.html", "lib/simple/**/*.html", "lib/simplylog/**/*.html"],
                dest: "temp/output",
                expand: true
            },
            fonts: {
                src: ["temp/lib/font-awesome/fonts/**", "temp/lib/bootstrap/fonts/**"],
                dest: "temp/output/app/fonts/",
                flatten: true,
                expand: true
            },
            bootstrap: {
                src: ["temp/lib/bootstrap/img/**", "temp/lib/bootstrap/rtl/img/**"],
                dest: "temp/output/app/img/",
                flatten: true,
                expand: true
            },
            config: {
                src: ["../config.xml"],
                dest: "temp/output/config.xml",
                options: {
                    process: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                }
            },
            assets: {
                src: ["../assets/**"],
                dest: "temp/output/assets/",
                expand: true
            }
        },
        cssmin: {
            build: {
                files: {
                    'temp/app.min.css': [
    "temp/app/common/directives/numpad/numpad.css",
    "temp/app/common/directives/app-header/app-header.css",
    "temp/lib/simple/directives/scan-barcode/scan-barcode.css",
    "temp/app/css/app.css"
                    ]
                }
            }
        },
        clean: {
            build: {
                src: ["temp"]
            }
        },
        "phonegap-build": {
            debug: {
                options: {
                    archive: "temp/InspectorApp.<%= pkg.version %>.zip",
                    "appId": "994628",
                    "user": {
                        "email": "yairc@mobideo.com",
                        "password": "ty5259"
                    },
                    keys: {
                        ios: { "password": "Smallfish00" },
                        android: { "key_pw": "Smallfish00", "keystore_pw": "Smallfish00" }
                    },
                    download: {
                        ios: "D:\\Deployments\\Inspector\\InspectorApp.<%= pkg.version %>.ipa",
                        android: "D:\\Deployments\\Inspector\\InspectorApp.<%= pkg.version %>.apk"
                    }
                }
            }
        },
        compress: {
            app: {
                options: {
                    archive: "temp/InspectorApp.<%= pkg.version %>.zip"
                },
                files: [{ expand: true, src: "**/*", cwd: "temp/output/" }]
            }
        },
        gittag: {
            task: {
                options: {
                    tag: '<%= pkg.version %>',
                    message: 'Version <%= pkg.version %> Built successfully'
                }
            }
        },
        testflight: {
            iOS: {
                options: {
                    apiToken: '9ab03f6b1c7b5d0b5be582b7a5b92046_MTI3NDU2ODIwMTMtMDgtMzEgMTc6MjI6MDYuOTM1Mzc4',
                    teamToken: '8281d5eee01eac949c22e52ca8b9e8c5_NDAyOTM1MjAxNC0wNy0wNyAwODoyMjowMi43ODY2MzE',
                    file: "D:\\Deployments\\Inspector\\InspectorApp.<%= pkg.version %>.ipa",
                    notes: "Inspector Mobile, Version: <%= pkg.version %>",
                    distributionLists: ['Inspector'],
                    notify: true
                }
            },
            android: {
                options: {
                    apiToken: '9ab03f6b1c7b5d0b5be582b7a5b92046_MTI3NDU2ODIwMTMtMDgtMzEgMTc6MjI6MDYuOTM1Mzc4',
                    teamToken: '8281d5eee01eac949c22e52ca8b9e8c5_NDAyOTM1MjAxNC0wNy0wNyAwODoyMjowMi43ODY2MzE',
                    file: "D:\\Deployments\\Inspector\\InspectorApp.<%= pkg.version %>.apk",
                    notes: "Inspector Mobile, Version: <%= pkg.version %>",
                    distributionLists: ['Inspector'],
                    notify: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-phonegap-build');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-testflight');
    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy:build', 'cssmin', 'concat', 'concat', 'uglify', 'jade', 'copy:html', 'copy:fonts', 'copy:bootstrap', 'copy:config', 'copy:assets', 'bumpup', 'compress', 'phonegap-build:debug','testflight', 'clean', 'gittag']);
    grunt.registerTask('debug', ['clean', 'copy:build', 'cssmin', 'concat', 'concat', 'uglify', 'jade', 'copy:html', 'copy:fonts', 'copy:bootstrap', 'copy:config', 'copy:assets', 'bumpup', 'compress', 'phonegap-build:debug'/*,'testflight', 'clean', 'gittag'*/]);
};