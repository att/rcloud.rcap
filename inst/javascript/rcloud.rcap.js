((function() {

    'use strict';

    requirejs.config({
        paths: {
            'rcap': '../../shared.R/rcloud.rcap',
            'site': '../../shared.R/rcloud.rcap/js/site',
            'pages': '../../shared.R/rcloud.rcap/js/pages',
            'data': '../../shared.R/rcloud.rcap/js/data',
            'ui': '../../shared.R/rcloud.rcap/js/ui',
            'utils': '../../shared.R/rcloud.rcap/js/utils',
            'controls': '../../shared.R/rcloud.rcap/js/ui/controls',
            'templates': '../../shared.R/rcloud.rcap/js/ui/properties/templates',
            'controlTemplates': '../../shared.R/rcloud.rcap/js/ui/controls/templates',
            'pubsub': '../../shared.R/rcloud.rcap/vendor/pubsub-js/src/pubsub',
            'parsley': '../../shared.R/rcloud.rcap/vendor/parsleyjs/dist/parsley.min',
            'spectrum': '../../shared.R/rcloud.rcap/vendor/spectrum',
            'select2': '../../shared.R/rcloud.rcap/vendor/select2/dist',
            'quill': '../../shared.R/rcloud.rcap/js/vendor/quill',
            'ionrangeslider': '../../shared.R/rcloud.rcap/vendor/ionrangeslider',
            'datatables': '../../shared.R/rcloud.rcap/vendor/datatables.net/js',
            'datatablesbuttons': '../../shared.R/rcloud.rcap/vendor/datatables.net-buttons/js',
            'datatables.net': '../../shared.R/rcloud.rcap/vendor/datatables.net/js/jquery.dataTables',
            'datatables.net-buttons': '../../shared.R/rcloud.rcap/vendor/datatables.net-buttons/js/dataTables.buttons',
            'jquery.sparkline': '../../shared.R/rcloud.rcap/vendor/jquery.sparkline/dist',
            'css': '../../shared.R/rcloud.rcap/vendor/require-css/css',
            'text': '../../shared.R/rcloud.rcap/vendor/requirejs-text/text'
        },
        map: {
            '*': {
                'propertyParser': '../../shared.R/rcloud.rcap/vendor/requirejs-plugins/src/propertyParser'
            }
        }
    });

    var extractSessionInfo = function(sessionInfo) {
        return {
            nodeName: sessionInfo.nodename[0], // jshint ignore:line
            user: sessionInfo.user[0],
            nodeNameUserName: sessionInfo.user[0] + '@' + sessionInfo.nodename[0]
        };
    };
    var getURLParameter = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,''])[1].replace(/\+/g, '%20'))||null; // jshint ignore:line
    };
    var getNotebook = function() {
        return getURLParameter('notebook');
    };
    var userProfileKey = function(variable) {
        var varname = variable;
        if(variable === null || variable === undefined) {
            varname = '';
        }
        return 'rcap.notebook.' + getNotebook() + '.userProfile.' + varname;
    };

    return {
        init: function(ocaps, sessionInfo, k) {
            if (RCloud.UI.advanced_menu.add) {  // jshint ignore:line

                var po = RCloud.promisify_paths(ocaps, [  // jshint ignore:line
                    ['getRFunctions'],
                    ['getDummyFunctions'],
                    ['getRTime'],    // not currently used
                    ['getRCAPVersion'],
                    ['getRCAPStyles'],
                ], true);

                RCloud.UI.advanced_menu.add({ // jshint ignore:line
                    rcapDesigner: {
                        sort: 10000,
                        text: 'RCAP Designer',
                        modes: ['edit'],
                        action: function() {

                          if(window.shell.notebook.model.read_only()) { // jshint ignore:line
                            alert('RCAP cannot be used with read-only notebooks.');
                            return;
                          }

                            po.getRFunctions().then(function(res) {
                                window.RCAP = window.RCAP || {};
                                window.RCAP.getRFunctions = function() {
                                    if(typeof res === 'string') {
                                      return [res];
                                    }

                                    return res;
                                };
                            });

                            window.RCAP = window.RCAP || {};
                            window.RCAP.updateAllControls = function(dataToSubmit) {
                                po.updateAllControls(dataToSubmit).then(function(){});
                            };

                            po.getRCAPVersion().then(function(version) {
                                window.RCAP.getRCAPVersion = function() {
                                    return version;
                                };
                            });

                            po.getRCAPStyles().then(function(styles) {
                                window.RCAP.getRCAPStyles = function() {
                                    return _.map(styles, function(style) {
                                        return {
                                            package: style[0],
                                            title: style[1],
                                            description: style[2]
                                        };
                                    });
                                };
                            });

                            require(['rcap/js/designer'], function(Designer) {
                                new Designer().initialise(extractSessionInfo(sessionInfo));
                            });
                        }
                    }
                });

                RCloud.UI.share_button.add({ // jshint ignore:line
                    'rcap.html': {
                        sort: 1000,
                        page: 'shared.R/rcloud.rcap/rcap.html'
                    }
                });

                window.RCAP = window.RCAP || {};
                window.RCAP.userProfileKey = userProfileKey;
            } else {

                // this code is executed in 'mini' mode:
                var mini = RCloud.promisify_paths(ocaps, [  // jshint ignore:line
                        ['updateControls'],    // updateControls (called when a form value changes, or a form is submitted)
                        ['updateAllControls'],  // kicks off R plot rendering
                        ['getRCAPStyles'],
                        ['getUserProfileVariableValues'],
                        ['getUserProfileValue'],
                        ['createUploadDir']
                    ], true);

                window.RCAP = window.RCAP || {};
                window.RCAP.updateControls = function(dataToSubmit) {
                    mini.updateControls(dataToSubmit).then(function() {});
                };
                window.RCAP.updateAllControls = function(dataToSubmit) {
                    mini.updateAllControls(dataToSubmit).then(function() {});
                };

                window.RCAP.uploadData = function(uploadTask, callbacks) {
                    var options = {};
                    options.upload_ocaps = rcloud._ocaps.file_upload; // jshint ignore:line
                    options.upload_ocaps.upload_pathAsync = function() { // jshint ignore:line
                      return mini.createUploadDir(uploadTask.variableName, uploadTask.datasetName);
                    };
                    options.files = uploadTask.file[0].files;
                    RCloud.upload_files(options, callbacks); // jshint ignore:line
                };
                
                window.RCAP.userProfileKey = userProfileKey;
                window.RCAP.getUserProfileVariableValues = function(variableName) {
                    return mini.getUserProfileVariableValues(variableName).then(function(variables) {
                      if(typeof(variables) === 'object') {
                         return _.map(variables, function(variable) {
                              return {
                                  value: variable
                              };
                        });
                      } else {
                        return [ {value : variables} ];
                        }
                    });
                };
                window.RCAP.getUserProfileValue = function(variable) {
                      if (typeof(Storage) !== 'undefined') {
                          var key = window.RCAP.userProfileKey(variable);
                          var val = localStorage.getItem(key);
                          if(val === null) {
                            return Promise.resolve(null);
                          }
                          return Promise.resolve(JSON.parse(val));
                      }
                      return Promise.resolve(null);
                };
            }

            k();

        },

        initViewer: function(content, themeExists, sessionInfo, k) {
            require(['rcap/js/viewer'], function(Viewer) {
                new Viewer().initialise(content, themeExists, extractSessionInfo(sessionInfo));
                $('#rcloud-rcap-loading').remove();
                k();
            });
        },

        updateVariable: function() {

            // variableName, value, allValues, k OR
            // variableName, value, k
            var variableName, value, allValues, k;

            if(arguments.length === 3 || arguments.length === 4) {
                variableName = arguments[0];
                value = arguments[1];

                if(arguments.length === 3) {
                    k = arguments[2];
                } else {
                    allValues = arguments[2];
                    k = arguments[3];
                }

                // loop through:
                $('[data-variablename="' + variableName + '"]').each(function() {
                    require(['controls/form'], function(FormControl) {
                        new FormControl().updateControls(variableName, value, allValues);
                    });
                });
            }

            k();
        },

        updateControlAttribute: function(controlId, attributeName, attributeValue, k) {
            $('#' + controlId).attr(attributeName, attributeValue);
            k();
        },

        updateControl: function(controlId, data, k) {

            // get the control:
            var control = $('#' + controlId);

            if(control.attr('data-controltype') === 'datatable') {
                require(['controls/dataTable'], function(DataTableControl) {
                    new DataTableControl().updateData(controlId, data);
                });
            } else if(control.attr('data-controltype') === 'rtext') {
                require(['controls/rText'], function(RTextControl) {
                    new RTextControl().updateData(controlId, data);
                });
            }

            k();
        },

        getUserProfileValue: function(variable, k) {
          var result = null;
          if (typeof(Storage) !== 'undefined') {
              var key = window.RCAP.userProfileKey(variable);
              result = localStorage.getItem(key);
              if( result !== null ) {
                 result = JSON.stringify(_.map(JSON.parse(result), function(val) {
                          return val.value;
                    }));
              }
          }
          k(result); // JSON representation of array on NULL
        },

        setUserProfileValue: function(variable, values, k) {
          if (typeof(Storage) !== 'undefined') {
            var key = window.RCAP.userProfileKey(variable);
            if(values === null) {
              localStorage.removeItem(key);
            } else {
              var newValue = null;
              if(typeof(values) === 'object') {
                  newValue = _.map(values, function(val) {
                          return {
                              value: val
                          };
                    });
              } else {
                  newValue = [ {value : values} ];
              }
              localStorage.setItem(key, JSON.stringify(newValue));
            }
          }
          k();
        },

        listUserProfileVariables : function(k) {
          var res = null;
          if (typeof(Storage) !== 'undefined') {
            var result = [];
            var userProfileKey = window.RCAP.userProfileKey(null);
            for(var key in localStorage) {
              if(key.startsWith(userProfileKey)) {
                result.push(key.replace(userProfileKey, ''));
              }
            }
            res = JSON.stringify(result);
          }
          k(res);
        },

        consoleMsg: function(content, k) {
            console.log(content);
            k();
        },

    	resizeHtmlwidget: function(controlId, width, height, k) {
    	    var control = $('#' + controlId);
    	    control.find('iframe').width(width);
            control.find('iframe').attr('width', width);
            control.find('iframe').height(height);
            control.find('iframe').attr('height', height);
    	    k();
    	}
    };


})());
