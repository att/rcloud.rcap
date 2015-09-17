define(['pubsub', 'site/pubSubTable'], function(PubSub, pubSubTable) {

	'use strict';

    var MessageManager = function(options) {

        options = options || {};
        var messageTimeout = options.messageTimeout || 2000;
        var selector = '#rcap-message';

        this.initialise = function() {

            PubSub.subscribe(pubSubTable.showMessage, function(msg, message) {

                console.info('messageManager: pubSubTable.showMessage');

                // set the text and show for a little while:
                $(selector)
                	.text(message)
                	.fadeIn(500, function() {
                        setTimeout(function() {
                            $(selector).fadeOut(500);
                        }, messageTimeout);
                    });
            });
        };
    };

	return MessageManager;
});
