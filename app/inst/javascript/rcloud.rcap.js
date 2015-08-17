((function() {

    requirejs.config({
        paths: {
            'rcap' : '../../shared.R/rcloud.rcap',
            'controls' : '../../shared.R/rcloud.rcap/js/ui/controls',
            //'properties' : '../../shared.R/rcloud.rcap/js/ui/controls/properties',
            'templates' : '../../shared.R/rcloud.rcap/js/ui/controls/properties/templates',
            'pubsub' :  '../../shared.R/rcloud.rcap/js/vendor/pubsub-js/src/pubsub',
            'parsley' : '../../shared.R/rcloud.rcap/js/vendor/parsleyjs/dist/parsley.min',
            'spectrum' : '../../shared.R/rcloud.rcap/js/vendor/spectrum',
            'wysiwyg' : '../../shared.R/rcloud.rcap/js/vendor/wysiwyg.js/dist'
        },
        map: {
            '*' : {
                'css' : 'rcap/js/vendor/require-css/css',
                'text' : 'rcap/js/vendor/requirejs-text/text',
                'json' : 'rcap/js/vendor/requirejs-plugins/src/json',
                'font' : 'rcap/js/vendor/requirejs-plugins/src/font',
                'propertyParser' : 'rcap/js/vendor/requirejs-plugins/src/propertyParser'
            }
        }
    });

    return {
        init: function(ocaps, k) {
            require(['rcap/js/initialiser'], function(initialiser) {
                initialiser.bootstrap();
                k();
            });
        }
    };
})());