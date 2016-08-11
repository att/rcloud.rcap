({
    //baseUrl: './app/inst/www',
    baseUrl: './../',
    paths: {
        'rcap': 'app/inst/www',
        'controls': 'app/inst/www/js/ui/controls',
        'templates': 'app/inst/www/js/ui/controls/properties/templates',
        'pubsub': 'bower_components/pubsub-js/src/pubsub',
        'parsley': 'bower_components/parsleyjs/dist/parsley.min',
        'spectrum': 'bower_components/spectrum',
        'wysiwyg': 'bower_components/wysiwyg.js/dist',
        'vendor': 'bower_components',
        'jquery': 'empty:'
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css',
            'text': 'bower_components/requirejs-text/text',
            'json': 'bower_components/requirejs-plugins/src/json',
            'font': 'bower_components/requirejs-plugins/src/font',
            'propertyParser': 'bower_components/requirejs-plugins/src/propertyParser'
        }
    },
    shim: {
        'rcap/js/ui': {
            deps: [
                "css!rcap/styles/default.css"
            ]
        }
    },
    //optimize: 'none',
    name: 'rcap/js/initialiser',
    preserveLicenseComments: false,
    out: 'initialiser.js',
    exclude: ['text',
        'css'
    ],
    onBuildWrite: function(moduleName, path, contents) {
        contents = contents.replace(/'([^'])*text!/mgi, '\'');
        contents = contents.replace(/'([^'])*css!/mgi, '\'css');
        contents = contents.replace('cssrcap/styles/default.css', '');
        contents = contents.replace('define(\'cssrcap/styles/default\',[],function(){});', '');
        return contents;
    }


})
