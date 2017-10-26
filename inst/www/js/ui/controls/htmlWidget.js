define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/properties/autocompleteProperty',
    'rcap/js/ui/properties/textProperty',
    'text!controlTemplates/htmlWidget.tpl',
    'text!controlTemplates/htmlWidget-design.tpl'
], function(GridControl, AutocompleteProperty, TextProperty, tpl, dtpl) {

    'use strict';

    var HtmlWidgetControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'htmlwidget',
                controlCategory: 'Dynamic',
                label: 'HTML Widget',
                icon: 'certificate',
                controlProperties: [
                    new AutocompleteProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true,
                        horizontal: true
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
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value) {
                designTimeDescription += 'Function: ' + this.controlProperties[0].value;
            }

            var template = isDesignTime ? _.template(dtpl) : _.template(tpl);

            return template({
                control: this,
                designTimeDescription : designTimeDescription
            });

        },
        initialiseViewerItems: function() {
 
        }
    });

    return HtmlWidgetControl;


});