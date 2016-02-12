define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/leaflet.tpl',
    'text!controlTemplates/leaflet-design.tpl'
], function(GridControl, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var LeafletControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'leaflet',
                controlCategory: 'Dynamic',
                label: 'Leaflet',
                icon: 'map-marker',
                initialSize: [2, 2],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;

            var template = isDesignTime ? _.template(dtpl) : _.template(tpl);

            return template({
                control: this
            });

        },
        initialiseViewerItems: function() {
 
        }
    });

    return LeafletControl;

});
