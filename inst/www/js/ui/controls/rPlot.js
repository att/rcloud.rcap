define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/dropdownProperty',
    'rcap/js/ui/properties/autocompleteProperty',
    'text!controlTemplates/rPlot.tpl',
    'text!controlTemplates/rPlot-design.tpl'
], function(GridControl, TextProperty, DropdownProperty, AutocompleteProperty, tpl, dtpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rplot',
                controlCategory: 'Dynamic',
                label: 'R Plot',
                icon: 'signal',
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
                        isRequired: false,
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
                    }),
                    new TextProperty({
                        uid: 'order',
                        label: 'Order',
                        defaultValue: '',
                        helpText: 'The order in which the control should be processed.',
                        codeHelpText: 'The order in which the control should be processed.',
                        isRequired: false
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
