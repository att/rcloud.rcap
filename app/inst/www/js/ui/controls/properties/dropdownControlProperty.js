define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/dropdownControl.tpl'], function(BaseControlProperty, tpl) {
	
	'use strict';

	var DropdownControlProperty = BaseControlProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'dropdown',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				uid : options.uid,
				className : options.className,
				value: options.value
			});

			// additional assignments go here:
			this.availableOptions = options.availableOptions || [];
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {
			return $('#form-group-' + this.id).find('select option:selected').val();
		}
	});

	return DropdownControlProperty;

});