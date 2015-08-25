module.exports = function(grunt) {

    'use strict';

    // Configurable paths for the application
    var appConfig = {
        appPath: require('./bower.json').appPath || 'app',

        /**************************************************************************
        //
        //  this should change:
        //
        //
        **************************************************************************/
        devDeployDir: 'C:/VAGRANT/vagrantRcloud-master/rcloud.rcap-develop',
        distDeployDir: 'C:/VAGRANT/vagrantRcloud-master/rcloud.rcap-dist',
        cmdDir: 'C:/VAGRANT/vagrantRcloud-master',
        dist: 'dist',
        distFiles: [
            'DESCRIPTION',
            'README.md',    
            'inst/javascript/rcloud.rcap.js',
            'inst/www/js/initialiser.js',
            'R/**/*'
        ]
    };

    

    // 1. All configuration goes here 
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        appConfig: appConfig,

        sass: {
            all: {
                options: {

                },
                files: {
                    'app/inst/www/styles/default.css': 'app/inst/www/styles/default.scss'
                },
                trace: true
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= appConfig.appPath %>/javascript/{,*/}*.js',
                    '<%= appConfig.appPath %>/inst/www/js/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/dialogs/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/factories/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/properties/*.js',
                ]
            }

        },

        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: ['<%= appConfig.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {

                }
            }
        },

        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    dest: '<%= appConfig.devDeployDir%>/',
                    src: [
                        'inst/**/*',
                        'R/**/*',
                        '!**/*.scss' // we don't want the scss file(s)
                    ]
                }, {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/inst/www/bower_components',
                    src: [
                        '**/*.js'
                    ]
                }, {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/inst/www/bower_components',
                    src: [
                        '**/*.css'
                    ]
                }, {
                    cwd: 'app',
                    expand: true,
                    dest: '<%= appConfig.devDeployDir%>',
                    src: [
                        'DESCRIPTION',
                        'README.md'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    dest: '<%= appConfig.distDeployDir%>/',
                    src: '<%= appConfig.distFiles%>'
                }]
            }
        },

        clean: {
            dev: {
                options: {
                    force: true
                },
                files: [{
                    dot: true,
                    src: [
                        '<%= appConfig.devDeployDir %>/{,*/}*'
                    ]
                }]
            },
            dist: {
                options: {
                    force: true
                },
                files: [{
                    dot: true,
                    src: [
                        '<%= appConfig.distDeployDir %>/{,*/}*'
                    ]
                }]
            }
        },

        shell: {
            dev: {
                command: [
                    'cd <%= appConfig.cmdDir %>',
                    'vagrant ssh -- sh rebuild.sh'
                ].join('&& ')
            },
            dist: {
                command: [
                    'node r.js -o build.js',
                    'move ui.js <%= appConfig.distDeployDir %>/inst/www/js/ui.js',
                    //'cd <%= appConfig.cmdDir %>',
                    //'vagrant ssh -- sh rebuild.sh dist'
                ].join(' && '),
                options: {
                    execOptions: {
                        cwd: 'build'
                    }
                }
            }
        },

        open: {
            dev: {
                path: 'http://192.168.33.10:8080/login.R',
                app: 'chrome'
            }
        },

    });

    // 2. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');

    require('time-grunt')(grunt);

    // 3. Where we tell Grunt what to do when we type "grunt" into the terminal.
    // dev, opens chrome with built dev:
    grunt.registerTask('default', ['newer:jshint', 'clean:dev', 'copy:dev', 'shell:dev', 'open:dev']);

    // dist, build production code:
    grunt.registerTask('dist', ['newer:jshint', 'clean:dist', 'copy:dist', 'shell:dist' /*, 'open'*/ ]);

};
