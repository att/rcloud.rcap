define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/leaflet.tpl',
    'text!controlTemplates/leaflet-design.tpl'
], function(GridControl, AutocompleteControlProperty, TextControlProperty, DropdownControlProperty, PubSub, pubSubTable, tpl, dtpl) {

    'use strict';

    var LeafletControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'leaflet',
                controlCategory: 'Dynamic',
                label: 'Leaflet',
                icon: 'map-marker',
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
                    }),
                    new TextControlProperty({
                        uid: 'linkUrl',
                        label : 'Link url',
                        defaultValue : '',
                        helpText : 'Link url',
                        isRequired: false,
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
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
                        value: '_self',
                        isHorizontal: false
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
