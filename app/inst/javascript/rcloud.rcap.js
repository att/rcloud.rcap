((function() {

    requirejs.config({
        paths: {
            'rcap' : '../../shared.R/rcloud.rcap',
            'controls' : '../../shared.R/rcloud.rcap/js/ui/controls',
            'templates' : '../../shared.R/rcloud.rcap/js/ui/controls/properties/templates'
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