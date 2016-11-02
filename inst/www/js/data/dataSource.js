define(['rcap/js/Class'], function() {

    'use strict';

    var DataSource = Class.extend({
        init: function(options) {
            options = options || {};

            this.id = 'rcap' + Math.random().toString(16).slice(2);
            this.variable = '';
            this.code = '';
        },
        toJSON: function() {
            return {
                'id' : this.id,
                'variable': this.variable,
                'code': this.code,
                'type': 'dataSource'
            };
        }
    });

    return DataSource;
});