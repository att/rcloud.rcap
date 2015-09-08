define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty', 
    'rcap/js/ui/controls/properties/dropdownControlProperty', 
	'text!rcap/js/ui/controls/child/templates/heading.tpl'], function(BaseControl, TextControlProperty, DropdownControlProperty, tpl) {

    'use strict';

    var HeadingControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'heading',
                label: 'Heading',
                icon: 'f031',
                inlineIcon: 'font',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'text',
                        label: 'Text',
                        defaultValue: 'Heading'
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
                            text: 'Small',
                            value: 'h3'
                        }, {
                            text: 'Smallest',
                            value: 'h4'
                        }],
                        value: 'h1' // default to the largest 'h1'
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
