define(['rcap/js/ui/properties/baseProperty', 'text!templates/radioButtonGroup.tpl'], function(BaseProperty, tpl) {
	
	'use strict';

	var RadioButtonGroupProperty = BaseProperty.extend({
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
			this.radioButtonOptions = options.radioButtonOptions || [];
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {
			return $('#' + this.id + ' input[type="radio"]:checked:first').val();
		}
	});

	return RadioButtonGroupProperty;

});