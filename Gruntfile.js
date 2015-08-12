module.exports = function(grunt) {

    'use strict';

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        deployDir: 'C:/VAGRANT/vagrantRcloud-master/rcloud.rcap-develop',
        cmdDir: 'C:/VAGRANT/vagrantRcloud-master',
        dist: 'dist'
    };

    // 1. All configuration goes here 
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        app: appConfig,

        copy: {
            deploy: {
                files: [
                {
                    expand: true,
                    cwd: 'app',
                    dest: '<%= app.deployDir%>/',
                    src: [
                        'inst/**/*',
                        'R/**/*',
                        '!**/*.scss'    // we don't want the scss file(s)
                    ]
                },
                {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= app.deployDir%>/inst/www/js/vendor',
                    src: [
                        '**/*.js'   
                    ]
                }, 
                {
                    expand: true,
                    cwd: 'bower_components/',
                    dest: '<%= app.deployDir%>/inst/www/js/vendor',
                    src: [
                        '**/*.css'   
                    ]
                }, 
                {
                    cwd: 'app',
                    expand: true,
                    dest: '<%= app.deployDir%>',
                    src: [
                        'DESCRIPTION',
                        'README.md'
                    ]
                }]
            }
        },

        shell: {
            multiple: {
                command: [
                    'cd <%= app.cmdDir %>',
                    'vagrant ssh -- sh doit.sh'
                ].join('&& ')
            }
        },

        open: {
            dev: {
                path: 'http://192.168.33.10:8080/login.R',
                app: 'chrome'
            }
        },

        clean: {
            dist: {
                options: {
                    force: true
                },
                files: [{
                    dot: true,
                    src: [
                        '<%= app.deployDir %>/{,*/}*'
                    ]
                }]
            }
        },

        sass: {
            dist: {
                options: {
               //     style: 'compressed'
                },                
                files: {
                    'app/inst/www/styles/default.css': 'app/inst/www/styles/default.scss'
                }
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
                '<%= app.app %>/javascript/{,*/}*.js',
               // '!<%= app.app %>/inst/www/js/vendor/{,*/}*.js',
                '<%= app.app %>/inst/www/js/*.js',
                '<%= app.app %>/inst/www/js/ui/*.js',
                '<%= app.app %>/inst/www/js/ui/controls/*.js',
                '<%= app.app %>/inst/www/js/ui/controls/dialogs/*.js',
                '<%= app.app %>/inst/www/js/ui/controls/factories/*.js',
                '<%= app.app %>/inst/www/js/ui/controls/properties/*.js',

            ]
          },
          // test: {
          //   options: {
          //     jshintrc: 'test/.jshintrc'
          //   },
          //   src: ['test/spec/{,*/}*.js']
          // }
        },

        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: ['<%= app.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                  //livereload: '<%= connect.options.livereload %>'
                }
            }
        }

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
    grunt.registerTask('default', ['newer:jshint', 'clean', 'copy', 'shell', 'open']);

};
