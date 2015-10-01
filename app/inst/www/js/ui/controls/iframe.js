define(['rcap/js/ui/controls/gridControl', 'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/ui/controls/properties/colorControlProperty', 
    'rcap/js/ui/controls/properties/radioButtonGroupControlProperty', 
    'rcap/js/ui/controls/properties/checkboxListControlProperty',
    'text!controlTemplates/iframe.tpl'

], function(GridControl, TextControlProperty, DropdownControlProperty, ColorControlProperty, RadioButtonGroupControlProperty,
    CheckboxListControlProperty, tpl) {

    'use strict';

    var IFrameControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'iframe',
                label: 'iFrame',
                icon: 'f0c2',
                inlineIcon: 'cloud',
                initialSize: [2, 2],
                controlProperties: [
                    new TextControlProperty({
                        uid: 'source',
                        label: 'Source',
                        defaultValue: '',
                        helpText: 'The URL that the iFrame will show (prefix with http://)',
                        isRequired: true,
                        validationDataType: 'url'
                    }),
                    /*
                    new RadioButtonGroupControlProperty({
                        uid: 'testRbg',
                        radioButtonOptions: [{
                            label: 'Option 1',
                            value: '1'
                        }, {
                            label: 'Option 2',
                            value: '2'
                        }, {
                            label: 'Option 3',
                            value: '3'
                        }, {
                            label: 'Option 4',
                            value: '4'
                        }, {
                            label: 'Option 5',
                            value: '5'
                        }, {
                            label: 'Option 6',
                            value: '6'
                        }]
                    }),
                    new CheckboxListControlProperty({
                        uid: 'testCbl',
                        checkboxListOptions: [{
                            label: 'Option 1',
                            value: '1'
                        }, {
                            label: 'Option 2',
                            value: '2'
                        }, {
                            label: 'Option 3',
                            value: '3'
                        }]
                    }),*/
                    /*,
                    new DropdownControlProperty({
                        uid: 'testdropdown',
                        label: 'Test dropdown',
                        helpText: 'This is for testing purposes only',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Option 1',
                            value: '1'
                        }, {
                            text: 'Option 2',
                            value: '2'
                        }]
                    }),
                    new ColorControlProperty({
                        uid: 'bordercolor',
                        label: 'Border color',
                        helpText: 'The color of the border for this control'
                    }),
                    new ColorControlProperty({
                        uid: 'backgroundcolor',
                        label: 'Background color',
                        helpText: 'The color of the background for this control'
                    })*/
                ]
            });
        },
        render: function() {

            var template = _.template(tpl);

            return template({
                control: this
            });

        }
            // ,
            // getConfigurationMarkup : function() {
            //  return '<p><i class="icon-' + this.inlineIcon + '"></i>' + (this.controlProperties[0].value || '') + '</p>';            
            // }
    });

    return IFrameControl;

});