define(['rcap/js/ui/controls/baseControl', 'text!rcap/partials/dialogs/_formBuilder.htm'], function(BaseControl, tpl) {

    'use strict';

    var FormControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'form',
                label: 'Form',
                icon: 'f022',
                inlineIcon: 'list-alt',
                initialSize: [2, 4],
                controlProperties: [

                ]
            });
        },
        render: function() {
            return 'I am a form.';
        },
        getDialogMarkup: function() {
        	return tpl;
        }
    });

    return FormControl;

});
