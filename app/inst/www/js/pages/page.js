define(['rcap/js/Class'], function() {

    'use strict';

    var Page = Class.extend({
        init: function(options) {
            options = options || {};
            
            this.navigationTitle = options.navigationTitle || 'New Page';
            //this.pageTitle = options.pageTitle || 'New Page';
            //this.urlSlug = options.urlSlug || '/new-page';

            this.controls = options.controls || [];

            this.id = options.id || 'rcap' + Math.random().toString(16).slice(2);

        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function() {
            
        },
        getDialogMarkup: function() {
            
        },
        getDialogValue: function() {

        },
        toJSON: function() {

            return {
                'id' : this.id,
                'navigationTitle' : this.navigationTitle, 
                //'pageTitle' : this.pageTitle,
                //'urlSlug' : this.urlSlug,
                'controls' : this.controls
            };

        },
        getControlByID: function(controlID) {
            return _.findWhere(this.controls, { id : controlID });
        }
    });

    return Page;

});
