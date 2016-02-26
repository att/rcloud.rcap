define([], function() {
    
    'use strict';

    return function() {

        var me = this,
        messagesOn = localStorage.getItem('rcap-logging') === 'on';
        
        ['log', 'info', 'warn', 'error'].forEach(function(consoleFunc) {
            me[consoleFunc] = messagesOn ? function() { console[consoleFunc].apply(console, arguments); } : function() {};
        });
        
    };

});