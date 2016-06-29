define(['pubsub', 'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var DirtyStateIndicator = function() {
        this.initialise = function() {
            [
                { key: pubSubTable.stateModified, action: 'show' },
                { key: pubSubTable.saved, action: 'hide' },
            ].forEach(function(i) {
                PubSub.subscribe(i.key, function() { $('#state-modified i')[i.action](); });             
            });
        };
    };

    return DirtyStateIndicator;
});
