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
                	.stop()	// cancel any previous animation shenanigans
                	.hide()	// and start from a hidden state
                	.removeClass(message.getValidMessageTypes().join(' ').toLowerCase())
                	.addClass(message.messageType.toLowerCase())
                	.text(message.content)
                	.fadeIn(500, function() {
                        setTimeout(function() {

                            var preMoveTop = $(selector).css('top');

                            $(selector).animate({ 'top' : '-=100' }, 500, function() { 
                                $(this).hide(); 
                                $(this).css('top', preMoveTop); 
                            });

                        }, messageTimeout);
                    });
            });
        };
    };

	return MessageManager;
});