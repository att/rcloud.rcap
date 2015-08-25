define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/ui/controls/properties/colorControlProperty', 
    'text!controlTemplates/iframe.tpl'

], function(BaseControl, TextControlProperty, DropdownControlProperty, ColorControlProperty, tpl) {

    'use strict';

    var IFrameControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'iframe',
                label: 'iFrame',
                icon: 'f0c2',
                inlineIcon: 'cloud',
                initialSize: [6, 3],
                controlProperties: [
                    new TextControlProperty({
                        uid: 'source',
                        label: 'Source',
                        defaultValue: '',
                        helpText: 'The URL that the iFrame will show',
                        isRequired: true
                    })/*,
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
            // 	return '<p><i class="icon-' + this.inlineIcon + '"></i>' + (this.controlProperties[0].value || '') + '</p>';			
            // }
    });

    return IFrameControl;

});
