((function() {

    requirejs.config({
        paths: {
            'rcap': '../../shared.R/rcloud.rcap',
            'site': '../../shared.R/rcloud.rcap/js/site',
            'pages': '../../shared.R/rcloud.rcap/js/pages',
            'ui': '../../shared.R/rcloud.rcap/js/ui',
            'controls': '../../shared.R/rcloud.rcap/js/ui/controls',
            'templates': '../../shared.R/rcloud.rcap/js/ui/controls/properties/templates',
            'controlTemplates': '../../shared.R/rcloud.rcap/js/ui/controls/templates',
            'pubsub': '../../shared.R/rcloud.rcap/bower_components/pubsub-js/src/pubsub',
            'parsley': '../../shared.R/rcloud.rcap/bower_components/parsleyjs/dist/parsley.min',
            'spectrum': '../../shared.R/rcloud.rcap/bower_components/spectrum',
            'select2': '../../shared.R/rcloud.rcap/bower_components/select2/dist',
            'wysiwyg': '../../shared.R/rcloud.rcap/bower_components/wysiwyg.js/dist',
            'ionrangeslider': '../../shared.R/rcloud.rcap/bower_components/ionrangeslider',
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

    return {
        init: function(ocaps, k) {

            if (RCloud.UI.advanced_menu.add) {

                po = RCloud.promisify_paths(ocaps, [
                    ['getRFunctions'],
                    ['getDummyFunctions'],
                    ['getRTime']
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

                            po.getRTime().then(function(res) {
                                console.log('%cgetRTime returned ' + res, 'padding: 5px; font-size: 16pt; border: 1px solid black; background: #eee; color: #f00');
                            });

                            require(['rcap/js/designer'], function(Designer) {
                                new Designer().initialise();
                            });
                        }
                    }
                });
            }

            k();

        },

        initViewer: function(content, k) {
            require(['rcap/js/viewer'], function(Viewer) {
                new Viewer().initialise(content);
                k();
            });
        },

        updateVariable: function(variableName, value, k) {
            // implement something in here, for now, just log to console:

            require(['controls/form'], function(FormControl) {
                new FormControl().updateControls(variableName, value);
                k();
            });
        },

        consoleMsg: function(content, k) {
            console.log(content);
            k();
        }
    };

})());
