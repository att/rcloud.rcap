define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/dropdownControl.tpl'], function(BaseControlProperty, tpl) {
	
	'use strict';

	var DropdownControlProperty = BaseControlProperty.extend({
		init: function(options) {
			this._super({
				type : options.type,
				label : options.label,
				helpText : options.helpText,
				defaultValue : options.defaultValue,
				isRequired : options.isRequired
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