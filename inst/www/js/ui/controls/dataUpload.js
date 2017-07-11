define(['rcap/js/ui/controls/gridControl',
  'rcap/js/ui/properties/textProperty',
  'utils/variableHandler',
  'text!controlTemplates/dataUpload.tpl'
], function (GridControl, TextProperty, variableHandler, tpl) {

  'use strict';

  var RPlotControl = GridControl.extend({
    init: function () {
      this._super({
        type: 'dataupload',
        controlCategory: 'Dynamic',
        label: 'Data Upload',
        icon: 'cloud-upload',
        initialSize: [2, 2],
        controlProperties: [
          new TextProperty({
            uid: 'variablename',
            label: 'Variable',
            helpText: 'The variable associated with this data upload',
            isRequired: true
          }),
          new TextProperty({
            uid: 'buttonText',
            label: 'Button Text',
            defaultValue: '',
            helpText: 'The text that appears on the button',
            isRequired: true
          })
        ]
      });
    },
    getVariableData: function () {

    },
    render: function () {

      var template = _.template(tpl);

      return template({
        control: this
      });

    },
    initialiseViewerItems: function () {

      $('[data-controltype="dataupload"]').click(function () {
        // variableHandler.submitChange({
        //   variableName: $(this).attr('data-variablename'),
        //   controlId: $(this).attr('id'),
        //   value: Math.random().toString(16).slice(2).substring(0, 6)
        // });
      });
    }
  });

  return RPlotControl;


});
