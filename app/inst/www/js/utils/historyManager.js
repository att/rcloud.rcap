define([
    'pubsub',
    'site/pubSubTable'
], function(PubSub, pubSubTable) {

    'use strict';

    var HistoryManager = function() {

        this.initialise = function() {
            window.addEventListener('popstate', function( /*e*/ ) {
                console.log('history manager: popstate');
            });

            window.onhashchange = function() {
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, location.hash.substring(1));
            };
        };

        this.setInitialState = function() {
            if (location.hash.length) {
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, location.hash.substring(1));
            }
        };

    };

    return HistoryManager;

});
