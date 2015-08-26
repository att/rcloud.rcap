define([], function() {

    'use strict';

    return {

        bootstrap: function() {

            RCloud.UI.share_button.add({ // jshint ignore:line
                'Design': {
                    sort: 1001,
                    page: 'shared.R/rcloud.rcap/default.html'
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            RCloud.UI.share_button.add({ // jshint ignore:line
                'View': {
                    sort: 1002,
                    page: 'shared.R/rcloud.rcap/view.html'
                }
            });

            // for rcap link, don't move away, simply initialise:
            $('body').on('click', '#share-link[href*="shared.R/rcloud.rcap/view.html"]', function(e) {

                require(['rcap/js/viewer'], function(viewer){
                    viewer.initialiseFromMenu();
                });

                e.preventDefault();
                return false;
            });
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // for rcap link, don't move away, simply initialise:
            $('body').on('click', '#share-link[href*="shared.R/rcloud.rcap/default.html"]', function(e) {

                require(['rcap/js/designer'], function(designer){
                    designer.initialise();
                });

                e.preventDefault();
                return false;
            });
            
        }
    };
});