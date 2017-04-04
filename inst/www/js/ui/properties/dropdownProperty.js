define(['rcap/js/ui/properties/baseProperty', 'text!templates/dropdownControl.tpl'], function(BaseProperty, tpl) {

	'use strict';

	var DropdownProperty = BaseProperty.extend({
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
			this.isHorizontal = _.isUndefined(options.isHorizontal) ? true : options.isHorizontal;
		},
		render: function(childIndex) {

			var template = _.template(tpl);

      return template({
        property : this,
        childIndex : childIndex
      });

		},
		getDialogValue : function() {
			return $('#' + this.id).find('option:selected').val();
		}
	});

	return DropdownProperty;

});
