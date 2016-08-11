define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty', 
    'rcap/js/ui/controls/properties/dropdownControlProperty', 
	'text!rcap/js/ui/controls/child/templates/heading.tpl'], function(BaseControl, TextControlProperty, DropdownControlProperty, tpl) {

    'use strict';

    var HeadingControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'heading',
                label: 'Heading',
                icon: 'font',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'text',
                        label: 'Text',
                        defaultValue: 'Heading',
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'testdropdown',
                        label: 'Heading type',
                        helpText: 'Heading size',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Largest',
                            value: 'h1'
                        }, {
                            text: 'Large',
                            value: 'h2'
                        }, {
                            text: 'Medium',
                            value: 'h3'
                        }, {
                            text: 'Small',
                            value: 'h4'
                        }, {
                            text: 'Smallest',
                            value: 'h5'
                        }],
                        value: 'h1', // default to the largest 'h1'
                        isHorizontal: false
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

    return HeadingControl;

});
