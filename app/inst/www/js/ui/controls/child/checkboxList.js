define(['rcap/js/ui/controls/baseControl', 
	'text!rcap/js/ui/controls/child/templates/checkboxList.tpl'], function(BaseControl, tpl) {
	
	'use strict';

	var CheckboxListControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'checkboxlist',
				label : 'Checkbox Group',
				icon: 'f00c',  
				inlineIcon: 'check',
				controlProperties: [
					
				]
			});
		},
		render: function() {
			var template = _.template(tpl);

            return template({
                control: this
            });
		},
		getDialogMarkup: function() {
			return 'CBL: THIS IS WHAT YOU SHOULD SEE IN THE DIALOG!';
		}
	});

	return CheckboxListControl;

});