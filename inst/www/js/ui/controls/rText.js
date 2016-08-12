define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/rText.tpl',
    'text!controlTemplates/rText-design.tpl'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var RTextControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rtext',
                controlCategory: 'Dynamic',
                label: 'R Text',
                icon: 'edit',
                initialSize: [4, 4],
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
