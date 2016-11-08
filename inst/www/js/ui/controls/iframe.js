define(['rcap/js/ui/controls/gridControl', 
    //'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/autocompleteProperty',
    'rcap/js/ui/properties/dropdownProperty',
    'rcap/js/ui/properties/colorProperty', 
    'rcap/js/ui/properties/radioButtonGroupProperty', 
    'rcap/js/ui/properties/checkboxListProperty',
    'text!controlTemplates/iframe.tpl'

], function(GridControl, AutocompleteProperty, DropdownProperty, ColorProperty, RadioButtonGroupProperty,
    CheckboxListProperty, tpl) {

    'use strict';

    var IFrameControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'iframe',
                controlCategory: 'HTML',
                label: 'iFrame',
                icon: 'cloud',
                controlProperties: [
                    new AutocompleteProperty({
                        uid: 'source',
                        label: 'Source',
                        defaultValue: '',
                        helpText: 'The URL that the iFrame will show (prefix with http:// or https://), or the R Function that assigns the value',
                        isRequired: true
                    })
                ]
            });
        },
        render: function() {

            var template = _.template(tpl);

            return template({
                control: this
            });

        }
    });

    return IFrameControl;

});