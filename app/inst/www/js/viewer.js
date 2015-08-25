define(['text!rcap/partials/viewer.htm',
    'rcap/js/ui/gridManager',
    'pubsub',
    'rcap/js/serializer',
    'css!rcap/styles/default.css'
], function(mainPartial, GridManager, PubSub, serializer) {

    'use strict';

    return {

        initialise: function() {

            if ($('body').find('#rcap-viewer').length === 0) {

                $('body').append(mainPartial);

                // grid:
                var gridManager = new GridManager();
                gridManager.initialise();

                // initialise
                serializer.initialise();

                $('#rcap-viewer .close-viewer').click(function() {
                    $('#rcap-viewer').hide();
                });

            }

            $('#rcap-viewer').show();

            // kick off:
            PubSub.publish('rcap:deserialize', {
                type: 'viewer'
            });

        }
    };
});
