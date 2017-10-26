define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/autocompleteProperty',
    'text!controlTemplates/rText.tpl',
    'text!controlTemplates/rText-design.tpl'
], function(GridControl, TextProperty, AutocompleteProperty, tpl, dtpl) {

    'use strict';

    var RTextControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rtext',
                controlCategory: 'Dynamic',
                label: 'R Text',
                icon: 'edit',
                controlProperties: [
                    new AutocompleteProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
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

        },
        updateData : function(controlId, data) {
            $('#' + controlId).html(data);

        }
    });

    return RTextControl;


});
