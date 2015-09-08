define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/checkboxList.tpl'], function(BaseControlProperty, tpl) {
	
	'use strict';

	var CheckboxListControlProperty = BaseControlProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'radiobuttongroup',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				uid : options.uid,
				className : options.className				
			});

			// additional assignments go here:
			this.checkboxListOptions = options.checkboxListOptions || [];
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {

			return $('#' + this.id + ' input:checkbox:checked').map(function() {
				return $(this).val();
			}).get();

		}
	});

	return CheckboxListControlProperty;

});