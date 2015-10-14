define(['rcap/js/Class'], function() {

    'use strict';

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var Page = Class.extend({
        init: function(options) {
            options = options || {};

            this.navigationTitle = options.navigationTitle || 'New Page';
            this.isEnabled = true;
            this.depth = 1;
            this.parentId = options.parentId;
            this.id = options.id || generateId();

            this.controls = options.controls || [];
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
                'depth': this.depth,
                'id': this.id,
                'parentId' : this.parentId,
                'navigationTitle': this.navigationTitle,
                'isEnabled': this.isEnabled,
                //'pageTitle' : this.pageTitle,
                //'urlSlug' : this.urlSlug,
                'controls': this.controls,
                'pages': this.pages
            };

        },
        getControlByID: function(controlID) {
            return _.findWhere(this.controls, {
                id: controlID
            });
        },
        duplicate: function() {
            // returns a duplicate page, with new (unique) page ID and control IDs:
            var dupe = $.extend(true, {}, this);
            dupe.id = generateId();
            dupe.controls = [];

            _.each(this.controls, function(c) {
                dupe.controls.push($.extend(true, {}, c).regenerateId());
            });

            return dupe;
        },
        canAddChild: function() {
            return this.depth <= 2;
        }

    });

    return Page;

});
