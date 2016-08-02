define(['rcap/js/Class'], function() {

    'use strict';

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var Timer = Class.extend({
        init: function(options) {
            options = options || {};
            this.variable = "";
            this.id = 'rcap' + Math.random().toString(16).slice(2);
            this.interval = 60;
        },
        toJSON: function() {
            return {
                'id' : this.id,
                'variable': this.variable,
                'interval': this.interval,
                'type': 'timer'
            };
        }
    });

    return Timer;
});