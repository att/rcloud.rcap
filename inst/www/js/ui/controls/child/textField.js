define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty',
  'text!rcap/js/ui/controls/child/templates/textField.tpl'
], function (BaseControl, TextProperty, tpl) {

  'use strict';

  var TextFieldControl = BaseControl.extend({
    init: function () {
      this._super({
        type: 'textfield',
        label: 'Text Field',
        icon: 'check-empty',
        controlProperties: [
          new TextProperty({
            uid: 'label',
            label: 'Label',
            defaultValue: 'Label',
            helpText: 'The label for this control',
            isHorizontal: false
          }),
          new TextProperty({
            uid: 'variablename',
            label: 'Variable name',
            defaultValue: 'variable',
            helpText: 'The variable associated with this control',
            isRequired: true,
            isHorizontal: false
          }),
          new TextProperty({
            uid: 'text',
            label: 'Default text',
            defaultValue: '',
            isHorizontal: false
          }),
          new TextProperty({
            uid: 'controlwidth',
            label: 'Width',
            defaultValue: '',
            helpText: 'Specify as a percentage or pixels (e.g. 100% or 200px)',
            isHorizontal: false
          })
        ]
      });
    },
    render: function () {
      var template = _.template(tpl);

      return template({
        text: this.getPropertyValueOrDefault('text'),
        control: this
      });
    }
  });

  return TextFieldControl;

});
