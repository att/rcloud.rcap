define(['rcap/js/ui/controls/gridControl', 
    //'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/ui/controls/properties/colorControlProperty', 
    'rcap/js/ui/controls/properties/radioButtonGroupControlProperty', 
    'rcap/js/ui/controls/properties/checkboxListControlProperty',
    'text!controlTemplates/iframe.tpl'

], function(GridControl, AutocompleteControlProperty, DropdownControlProperty, ColorControlProperty, RadioButtonGroupControlProperty,
    CheckboxListControlProperty, tpl) {

    'use strict';

    var IFrameControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'iframe',
                controlCategory: 'HTML',
                label: 'iFrame',
                icon: 'cloud',
                initialSize: [4, 4],
                controlProperties: [
                    new AutocompleteControlProperty({
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