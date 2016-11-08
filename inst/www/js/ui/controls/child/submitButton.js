define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty', 
	'text!rcap/js/ui/controls/child/templates/submitButton.tpl'], function(BaseControl, TextProperty, tpl) {

    'use strict';

    var SubmitButtonControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'submitbutton',
                label: 'Submit Button',
                icon: 'youtube-play',
                controlProperties: [
                    new TextProperty({
                        uid: 'text',
                        label: 'Text',
                        defaultValue: 'Submit',
                        isHorizontal: false
                    })
                ]
            });
        },
		render: function() {
			var template = _.template(tpl);

            return template({
                text: this.getPropertyValueOrDefault('text')
            });
		}
    });

    return SubmitButtonControl;

});
