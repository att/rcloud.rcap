((function() {

    requirejs.config({
        paths: {
            'rcap': '../../shared.R/rcloud.rcap',
            'site': '../../shared.R/rcloud.rcap/js/site',
            'pages': '../../shared.R/rcloud.rcap/js/pages',
            'data': '../../shared.R/rcloud.rcap/js/data',
            'ui': '../../shared.R/rcloud.rcap/js/ui',
            'utils': '../../shared.R/rcloud.rcap/js/utils',
            'controls': '../../shared.R/rcloud.rcap/js/ui/controls',
            'templates': '../../shared.R/rcloud.rcap/js/ui/controls/properties/templates',
            'controlTemplates': '../../shared.R/rcloud.rcap/js/ui/controls/templates',
            'pubsub': '../../shared.R/rcloud.rcap/bower_components/pubsub-js/src/pubsub',
            'parsley': '../../shared.R/rcloud.rcap/bower_components/parsleyjs/dist/parsley.min',
            'spectrum': '../../shared.R/rcloud.rcap/bower_components/spectrum',
            'select2': '../../shared.R/rcloud.rcap/bower_components/select2/dist',
            'wysiwyg': '../../shared.R/rcloud.rcap/bower_components/wysiwyg.js/dist',
            'ionrangeslider': '../../shared.R/rcloud.rcap/bower_components/ionrangeslider',
            'datatables': '../../shared.R/rcloud.rcap/bower_components/datatables.net/js',
            'datatablesbuttons': '../../shared.R/rcloud.rcap/bower_components/datatables.net-buttons/js',
            'datatables.net': '../../shared.R/rcloud.rcap/bower_components/datatables.net/js/jquery.dataTables',
            'datatables.net-buttons': '../../shared.R/rcloud.rcap/bower_components/datatables.net-buttons/js/dataTables.buttons',
            'jquery.sparkline': '../../shared.R/rcloud.rcap/bower_components/jquery.sparkline/dist',
            'moment': '../../shared.R/rcloud.rcap/bower_components/min/moment.min'
        },
        map: {
            '*': {
                'css': 'rcap/bower_components/require-css/css',
                'text': 'rcap/bower_components/requirejs-text/text',
                'json': 'rcap/bower_components/requirejs-plugins/src/json',
                'font': 'rcap/bower_components/requirejs-plugins/src/font',
                'propertyParser': 'rcap/bower_components/requirejs-plugins/src/propertyParser'
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

    return {
        init: function(ocaps, sessionInfo, k) {

            // console.log(' ÛÛÛÛÛÛÛÛÛÛÛ     ÛÛÛÛÛÛÛÛÛ    ÛÛÛÛÛÛÛÛÛ   ÛÛÛÛÛÛÛÛÛÛÛ ');
            // console.log('°°ÛÛÛ°°°°°ÛÛÛ   ÛÛÛ°°°°°ÛÛÛ  ÛÛÛ°°°°°ÛÛÛ °°ÛÛÛ°°°°°ÛÛÛ');
            // console.log(' °ÛÛÛ    °ÛÛÛ  ÛÛÛ     °°°  °ÛÛÛ    °ÛÛÛ  °ÛÛÛ    °ÛÛÛ');
            // console.log(' °ÛÛÛÛÛÛÛÛÛÛ  °ÛÛÛ          °ÛÛÛÛÛÛÛÛÛÛÛ  °ÛÛÛÛÛÛÛÛÛÛ ');
            // console.log(' °ÛÛÛ°°°°°ÛÛÛ °ÛÛÛ          °ÛÛÛ°°°°°ÛÛÛ  °ÛÛÛ°°°°°°  ');
            // console.log(' °ÛÛÛ    °ÛÛÛ °°ÛÛÛ     ÛÛÛ °ÛÛÛ    °ÛÛÛ  °ÛÛÛ        ');
            // console.log(' ÛÛÛÛÛ   ÛÛÛÛÛ °°ÛÛÛÛÛÛÛÛÛ  ÛÛÛÛÛ   ÛÛÛÛÛ ÛÛÛÛÛ       ');
            // console.log('°°°°°   °°°°°   °°°°°°°°°  °°°°°   °°°°° °°°°°        ');

            if (RCloud.UI.advanced_menu.add) {

                var po = RCloud.promisify_paths(ocaps, [
                    ['getRFunctions'],
                    ['getDummyFunctions'],
                    ['getRTime'],    // not currently used
                    ['getRCAPVersion']
                ], true);

                RCloud.UI.advanced_menu.add({ // jshint ignore:line
                    rcapDesigner: {
                        sort: 10000,
                        text: 'RCAP Designer',
                        modes: ['edit'],
                        action: function() {

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

                            require(['rcap/js/designer'], function(Designer) {
                                new Designer().initialise(extractSessionInfo(sessionInfo));
                            });
                        }
                    }
                });

                RCloud.UI.share_button.add({
                    'rcap.html': {
                        sort: 1000,
                        page: 'shared.R/rcloud.rcap/rcap.html'
                    }
                });

            } else {

                // this code is executed in 'mini' mode:
                mini = RCloud.promisify_paths(ocaps, [
                        ['updateControls'],    // updateControls (called when a form value changes, or a form is submitted)
                        ['updateAllControls']  // kicks off R plot rendering
                    ], true);

                window.RCAP = window.RCAP || {};
                window.RCAP.updateControls = function(dataToSubmit) {
                    mini.updateControls(dataToSubmit).then(function() {});
                };
                window.RCAP.updateAllControls = function(dataToSubmit) {
                    mini.updateAllControls(dataToSubmit).then(function() {});
                };
            }

            k();

        },

        initViewer: function(content, themeExists, sessionInfo, k) {
            require(['rcap/js/viewer'], function(Viewer) {
                new Viewer().initialise(content, themeExists, extractSessionInfo(sessionInfo));
                k();
            });
        },

        updateVariable: function() {

            // variableName, value, allValues, k OR
            // variableName, value, k
            var variableName, value, allValues;

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
                $('[data-variablename="' + variableName + '"]').each(function(i/*, e*/) {
                    
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

            if(control.attr('data-controltype') == "datatable") {
                require(['controls/dataTable'], function(DataTableControl) {
                    new DataTableControl().updateData(controlId, data);
                });
            } else if(control.attr('data-controltype') == "rtext") {
                require(['controls/rText'], function(RTextControl) {
                    new RTextControl().updateData(controlId, data);
                });
            } 

            k();
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
