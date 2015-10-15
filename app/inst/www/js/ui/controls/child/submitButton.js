define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty', 
	'text!rcap/js/ui/controls/child/templates/submitButton.tpl'], function(BaseControl, TextControlProperty, tpl) {

    'use strict';

    var SubmitButtonControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'submitbutton',
                label: 'Submit Button',
                icon: 'youtube-play',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'text',
                        label: 'Text',
                        defaultValue: 'Submit'
                    })
                ]
            });
        },
		render: function() {
			var template = _.template(tpl);

            return template({
                text: this.getControlPropertyValueOrDefault('text')
            });
		}
    });

    return SubmitButtonControl;

});
