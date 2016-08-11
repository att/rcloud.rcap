define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/rPlot.tpl',
    'text!controlTemplates/rPlot-design.tpl'
], function(GridControl, TextControlProperty, DropdownControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rplot',
                controlCategory: 'Dynamic',
                label: 'R Plot',
                icon: 'signal',
                initialSize: [4, 4],
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

    return RPlotControl;


});
