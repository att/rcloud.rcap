define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/interactivePlot.tpl',
    'text!controlTemplates/interactivePlot-design.tpl'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var InteractivePlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'interactiveplot',
                controlCategory: 'Dynamic',
                label: 'Interactive Plot',
                icon: 'bar-chart',
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

    return InteractivePlotControl;

});
