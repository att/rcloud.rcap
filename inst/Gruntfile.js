module.exports = function(grunt) {

    'use strict';

    // Configurable paths for the application
    var appConfig = {
        appPath: require('./bower.json').appPath || 'app',

        /**************************************************************************
        //
        //  ::: TODO: modify dist settings :::
        //
        **************************************************************************/
        devDeployDir: 'output/rcloud.rcap',
        devRCommandDir:'output',
        //distDeployDir: '',
        //cmdDir: '',
        dist: 'dist',
        distFiles: [
            'DESCRIPTION',
            'README.md',
            'NAMESPACE',
            'inst/javascript/rcloud.rcap.js',
            'inst/www/js/initialiser.js',
            'R/**/*',
            'tests/**/*',
            'man/**/*'
        ]
    };

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
                    '<%= appConfig.appPath %>/inst/www/js/pages/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/site/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/child/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/dialogs/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/factories/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/ui/controls/properties/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/utils/*.js',
                    '<%= appConfig.appPath %>/inst/www/js/utils/translators/*.js'
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
                        'tests/**/*',
                        'man/**/*',
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
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/inst/www/bower_components',
                    src: [
                        '**/*.png'
                    ]
                }, {
                    cwd: 'app',
                    expand: true,
                    dest: '<%= appConfig.devDeployDir%>',
                    src: [
                        'DESCRIPTION',
                        'NAMESPACE',
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
            },
            output: ['<%= appConfig.devRCommandDir %>/'],
            outputtemp: ['<%= appConfig.devDeployDir %>/']
        },

        shell: {
            dev: {
                command: [
                    'cd /data/rcloud/',
                    'scripts/build_package.sh rcloud.packages/rcloud.rcap'
                ].join(' && ')
            },
            buildpackage: {
                command: [
                    'cd <%= appConfig.devRCommandDir%>',
                    'R CMD build rcloud.rcap'
                ].join(' && ')
            },
            installpackage: {
                command: [
                    'cd <%= appConfig.devRCommandDir%>',
                    'R CMD INSTALL `sed -n \'s/Package: *//p\' rcloud.rcap/DESCRIPTION`_`sed -n \'s/Version: *//p\' rcloud.rcap/DESCRIPTION`.tar.gz'
                ].join(' && ')  
            },
            /*

            revisit this:

            dist: {
                commandcd: [
                    'node r.js -o build.js',
                    'move initialiser.js <%= appConfig.distDeployDir %>/inst/www/js/initialiser.js',
                    //'cd <%= appConfig.cmdDir %>',
                    //'vagrant ssh -- sh rebuild.sh dist'
                ].join(' && '),
                options: {
                    execOptions: {
                        cwd: 'build'
                    }
                }
            }*/
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');

    require('time-grunt')(grunt);

    // dev
    grunt.registerTask('default', ['newer:jshint', 'clean:dev', 'sass', 'clean:output', 'copy:dev', 'shell:buildpackage', 'shell:installpackage', 'clean:outputtemp']);
    grunt.registerTask('buildpackage', ['newer:jshint', 'clean:dev', 'sass', 'clean:output', 'copy:dev', 'shell:buildpackage', 'clean:outputtemp']);

    // dist
    grunt.registerTask('dist', ['newer:jshint', 'clean:dist', 'copy:dist', 'shell:dist']);

};
