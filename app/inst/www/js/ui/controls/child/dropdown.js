define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty', 'text!rcap/js/ui/controls/child/templates/dropdown.tpl'],
	function(BaseControl, TextControlProperty, ColorControlProperty, tpl) {
	
	'use strict';

	var DropdownControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'dropdown',
				label : 'Dropdown',
				icon: 'f00b',  
				inlineIcon: 'list',
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control'
					}),
					new TextControlProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : '',
						helpText : 'The variable associated with this control',
						isRequired: true
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

	return DropdownControl;

});