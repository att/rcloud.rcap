define(['text!rcap/partials/viewer.htm', 
    'rcap/js/ui/gridManager',
    'pubsub',
    'rcap/js/serializer',
    'css!rcap/styles/default.css'
], function(mainPartial, GridManager, PubSub, serializer) {

    'use strict';

    return {

        initialise: function() {

            $('body').html('').append(mainPartial);

            // grid:
            var gridManager = new GridManager();
            gridManager.initialise();

            // initialise
            serializer.initialise();

            // kick off:
            PubSub.publish('rcap:deserialize', {});

            $('body').css('padding', '10px 0 0 0!important');
            
        }
    };
});
