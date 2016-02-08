define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/rPlot.tpl',
    'text!controlTemplates/rPlot-design.tpl'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rplot',
                controlCategory: 'Dynamic',
                label: 'R Plot',
                icon: 'signal',
                initialSize: [2, 2],
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
