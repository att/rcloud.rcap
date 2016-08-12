module.exports = function(grunt) {

    'use strict';

    // Configurable paths for the application
    var appConfig = {
        appPath: require('./bower.json').appPath || '.',

        /**************************************************************************
        //
        //  ::: TODO: modify dist settings :::
        //
        **************************************************************************/
        devDeployDir: '.',
        //distDeployDir: '',
        //cmdDir: '',
        distFiles: [
            'javascript/rcloud.rcap.js',
            'www/js/initialiser.js',
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
                    'www/styles/default.css': 'www/styles/default.scss'
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
                    '<%= appConfig.appPath %>/www/js/*.js',
                    '<%= appConfig.appPath %>/www/js/pages/*.js',
                    '<%= appConfig.appPath %>/www/js/site/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/controls/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/controls/child/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/controls/dialogs/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/controls/factories/*.js',
                    '<%= appConfig.appPath %>/www/js/ui/controls/properties/*.js',
                    '<%= appConfig.appPath %>/www/js/utils/*.js',
                    '<%= appConfig.appPath %>/www/js/utils/translators/*.js'
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
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/www/bower_components',
                    src: [
                        '**/*.js'
                    ]
                }, {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/www/bower_components',
                    src: [
                        '**/*.css'
                    ]
                }, {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= appConfig.devDeployDir%>/www/bower_components',
                    src: [
                        '**/*.png'
                    ]
                }]
            }
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
    grunt.registerTask(
	'default',
	['newer:jshint', 'sass', 'copy:dev' ]
    );

};
