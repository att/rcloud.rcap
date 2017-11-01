define(['pubsub',
'site/pubSubTable',
'rcap/js/ui/controls/gridControl',
'rcap/js/ui/properties/textProperty',
'text!controlTemplates/spinner.tpl'
], function (PubSub, pubSubTable, GridControl, TextProperty, tpl) {

'use strict';

var SpinnerControl = GridControl.extend({
  init: function () {
    this._super({
      type: 'spinner',
      controlCategory: 'Dynamic',
      label: 'Spinner',
      icon: 'spinner',
      initialSize: [2, 2],
      controlProperties: [
        new TextProperty({
          uid: 'variablename',
          label: 'Variable',
          helpText: 'The variable associated with this spinner',
          isRequired: true
        })
      ]
    });
  },
  render: function (options) {
    options = options || {};

    var template = _.template(tpl);

    return template({
      control: this,
      isDesignTime: options.isDesignTime || false
    });

  },
  initialiseViewerItems: function () {
    
  }
});

return SpinnerControl;


});
