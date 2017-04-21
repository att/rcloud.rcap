define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/multiOptionProperty', 'rcap/js/ui/properties/dropdownProperty', 'text!rcap/js/ui/controls/child/templates/dropdown.tpl'],
	function(BaseControl, TextProperty, MultiOptionProperty, DropdownProperty, tpl) {

	'use strict';

	var DropdownControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'dropdown',
				label : 'Dropdown',
				icon: 'list',
				controlProperties: [
					new TextProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control',
						isHorizontal: false
					}),
					new TextProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : 'variable',
						helpText : 'The variable associated with this control',
						isRequired: true,
						isHorizontal: false
					}),
					// options:
          new MultiOptionProperty({
              uid: 'options',
              label: 'Options',
              helpText: 'Enter options, one per line',
              value: [{
                  label: 'Option 1',
                  value: '1'
              }, {
                  label: 'Option 2',
                  value: '2'
              }],
              isRequired: true,
              isHorizontal: false
          }),
          // selection style (default or dialog)
          new DropdownProperty({
              uid: 'selectionStyle',
              label: 'Selection style',
              helpText: 'Specify "dialog" for options shown in a dialog',
              isRequired: false,
              availableOptions: [{
                  text: 'Dialog',
                  value: 'dialog'
              }],
              isHorizontal: false
          }),
				]
			});
		},
		render: function(options) {

			options = options || {};

      var template = _.template(tpl);

      return template({
          control: this,
          isDesignTime: options.isDesignTime || false
      });

		}
	});

	return DropdownControl;

});
