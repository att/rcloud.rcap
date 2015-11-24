define(['rcap/js/Class'], function() {

    'use strict';

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var DataSource = Class.extend({
        init: function(options) {
            options = options || {};

            this.id = 'rcap' + Math.random().toString(16).slice(2);
            this.variable = '';
            this['function'] = '';
        },
        toJSON: function() {
            return {
                'id' : this.id,
                'variable': this.variable,
                'code': this.function,
                'type': 'dataSource'
            };
        }

    });

    return DataSource;

});
