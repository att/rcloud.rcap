define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/properties/autocompleteProperty',
    'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/dropdownProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/leaflet.tpl',
    'text!controlTemplates/leaflet-design.tpl'
], function(GridControl, AutocompleteProperty, TextProperty, DropdownProperty, PubSub, pubSubTable, tpl, dtpl) {

    'use strict';

    var LeafletControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'leaflet',
                controlCategory: 'Dynamic',
                label: 'Leaflet',
                icon: 'map-marker',
                controlProperties: [
                    new AutocompleteProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
                    }),
                    new TextProperty({
                        uid: 'linkUrl',
                        label : 'Link url',
                        defaultValue : '',
                        helpText : 'Link url',
                        isRequired: false
                    }),
                    new DropdownProperty({
                        uid: 'linkTarget',
                        label: 'Link target',
                        isRequired: false,
                        availableOptions: [{
                            text: 'Same window',
                            value: '_self'
                        }, {
                            text: 'New window',
                            value: '_blank'
                        }],
                        helpText: 'Where should the link open',
                        value: '_self'
                    })
                ]
            });

            var me = this;

            PubSub.subscribe(pubSubTable.gridPageChangeComplete, function() {
                if($('#' + me.id).is(':visible')) {

                    var $leaflet = $('#' + me.id).find('.leaflet');

                    if($leaflet.length > 0) {
                        window.rcleaflet['#' + $leaflet.attr('id')].map.invalidateSize();
                    }
                }
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
