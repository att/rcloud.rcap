define([], function() {
    'use strict';

    return {
        bootstrap: function() {
            RCloud.UI.advanced_menu.add({   // jshint ignore:line
                rcap: {
                    sort: 10000,
                    text: 'RCAP Designer',
                    modes: ['edit'],
                    action: function() {
                        require(['rcap/js/designer'], function(designer) {
                            designer.initialise();
                        });
                    }
                }
            });
        }
    };
});