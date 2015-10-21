define(['rcap/js/ui/controls/properties/colorControlProperty', 'rcap/js/Class'], function(ColorControlProperty) {

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

            this.styleProperties = [
                new ColorControlProperty({
                    uid: 'backgroundColor',
                    label: 'Background Color',
                    helpText: '',
                    defaultValue: '#ffffff',
                    value: '#ffffff'
                })
            ];
        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function() {

        },
        getDialogMarkup: function() {

        },
        getStyleProperties: function() {
            return {
                'background-color' : this.styleProperties[0].value
            };
        },
        getStyleDialogMarkup: function() {
            // general style information controls:

            var markup = '<div class="style-details">';

            _.each(this.styleProperties, function(prop, index) {
                markup += prop.render(index);
            });

            markup += '<div style="clear:both" /></div>';

            return markup;
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
                'pages': this.pages,
                'styleProperties': this.styleProperties
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
