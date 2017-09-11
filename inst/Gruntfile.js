module.exports = function(grunt) {

    'use strict';

    var appConfig = {
        appPath: require('./bower.json').appPath || '.',
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
                    '!<%= appConfig.appPath %>/www/bower_components/**/*.js',
                    '!<%= appConfig.appPath %>/www/vendor/**/*.js'                    
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
                    '!<%= appConfig.appPath %>/www/bower_components/**/*.js',
                    '!<%= appConfig.appPath %>/www/vendor/**/*.js'
                ],
                tasks: ['newer:jshint:all']
            }
        },
        bower: {
            dev: {
                base: 'bower_components',
                dest: 'www/vendor',
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
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('main-bower-files');

    require('time-grunt')(grunt);

    // dev
    grunt.registerTask('default', ['newer:jshint', 'sass', 'bower:dev']);

};
