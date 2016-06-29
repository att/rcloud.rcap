define(['pubsub', 'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var DirtyStateIndicator = function() {

        var el = $('#state-modified');

        this.initialise = function() {

            PubSub.subscribe(pubSubTable.setDirty, function() {
                el.show();
            });

            PubSub.subscribe(pubSubTable.clearDirty, function() {
                el.hide();
            });
        };
    };

    return DirtyStateIndicator;
});