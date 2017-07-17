define(['pubsub',
  'site/pubSubTable',
  'rcap/js/ui/controls/gridControl',
  'rcap/js/ui/properties/textProperty',
  'utils/variableHandler',
  'text!controlTemplates/dataUpload.tpl'
], function (PubSub, pubSubTable, GridControl, TextProperty, variableHandler, tpl) {

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

      var uploader = $('#fileuploader').uploadFile({
        url: 'YOUR_FILE_UPLOAD_URL',
        fileName: 'myfile',
        autoSubmit: false,
        maxFileCount: 1,
        dragdropWidth: '300px',
        dragDropStr: 'Drag and drop file'
      });

      //console.log(uploader);

      $('#upload-form').data('uploaderObj', uploader);

      $('[data-controltype="dataupload"]').click(function () {
        PubSub.publish(pubSubTable.showDataUploadDialog);
      });
    }
  });

  return RPlotControl;


});
