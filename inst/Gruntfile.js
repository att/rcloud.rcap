module.exports = function(grunt) {

    'use strict';

    var appConfig = {
        appPath: require('./bower.json').appPath || '.',

        /**************************************************************************
        //
        //  ::: TODO: modify dist settings :::
        //
        **************************************************************************/
        devDeployDir: '.',
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
                    '<%= appConfig.appPath %>/javascript/**/*.js',
                    '<%= appConfig.appPath %>/www/**/*.js',
                    '!<%= appConfig.appPath %>/www/js/vendor/**/*.js',
                    '!<%= appConfig.appPath %>/www/bower_components/**/*.js'
                ]
            }
        },
        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: [
                    '<%= appConfig.app %>/javascript/**/*.js', 
                    '<%= appConfig.app %>/www/**/*.js',
                    '!<%= appConfig.appPath %>/www/js/vendor/**/*.js',
                    '!<%= appConfig.appPath %>/www/bower_components/**/*.js'
                ],
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
        },
        bower: {
            dev: {
                base: 'bower_components', // the path to the bower_components directory
                dest: 'public/vendor',
                options: {
                    checkExistence: true,
                    debugging: false,
                    paths: {
                        bowerDirectory: 'bower_components',
                        bowerrc: '.bowerrc',
                        bowerJson: 'bower.json'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('main-bower-files');

    require('time-grunt')(grunt);

    // dev
    grunt.registerTask('default', ['newer:jshint', 'sass', 'bower:dev']);

};
