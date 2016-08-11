define([], function() {

	'use strict';

    var Message = function(options) {

    	this.validMessageTypes = ['Information', 'Warning', 'Error'];

        options = options || {};

        var messageType = options.messageType || 'Information';

        if(this.validMessageTypes.indexOf(messageType) === -1) {
        	throw new Error('Message type ' + messageType + ' is not valid.');
        }

        if(!options.content){
        	throw new Error('Expected non zero length content parameter');
        }
        
        this.messageType = messageType;
        this.content = options.content;

    };

    Message.prototype.getValidMessageTypes = function() {
    	return this.validMessageTypes;
    };

	return Message;
});
