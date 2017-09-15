define(['pubsub',
'site/pubSubTable',
'rcap/js/ui/controls/gridControl',
'rcap/js/ui/properties/textProperty',
/*
'rcap/js/ui/properties/stringValueProperty',
'utils/variableHandler',
*/
'text!controlTemplates/message.tpl'
], function (PubSub, pubSubTable, GridControl, TextProperty, /*StringValueProperty, variableHandler,*/ tpl) {

'use strict';

var MessageControl = GridControl.extend({
  init: function () {
    this._super({
      type: 'message',
      controlCategory: 'Dynamic',
      label: 'Message',
      icon: 'comment',
      initialSize: [2, 2],
      controlProperties: [
        new TextProperty({
          uid: 'variablename',
          label: 'Variable',
          helpText: 'The variable associated with this message',
          isRequired: true
        })
      ]
    });
  },
  render: function () {

    var template = _.template(tpl);

    return template({
      control: this
    });

  },
  initialiseViewerItems: function () {
    
  }
});

return MessageControl;


});
