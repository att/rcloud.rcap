define(['pubsub',
  'site/pubSubTable',
  'rcap/js/ui/controls/gridControl',
  'rcap/js/ui/properties/textProperty',
  'rcap/js/ui/properties/stringValueProperty',
  'utils/variableHandler',
  'text!controlTemplates/dataDownload.tpl'
], function (PubSub, pubSubTable, GridControl, TextProperty, StringValueProperty, variableHandler, tpl) {

  'use strict';

  var DataUploadControl = GridControl.extend({
    init: function () {
      this._super({
        type: 'datadownload',
        controlCategory: 'Dynamic',
        label: 'Data Download',
        icon: 'cloud-download',
        initialSize: [2, 2],
        controlProperties: [
          new TextProperty({
            uid: 'variablename',
            label: 'Variable',
            helpText: 'The variable associated with this data download',
            isRequired: true
          }),
          /*new TextProperty({
            uid: 'allowedtypes',
            label: 'Allowed types',
            helpText: 'List of allowed file types, comma-separated, e.g. csv,tsv. Leave blank for "all"',
            isRequired: false
          }),*/
          new TextProperty({
            uid: 'buttontext',
            label: 'Button Text',
            defaultValue: '',
            helpText: 'The text that appears on the button',
            isRequired: true
          }),
          new StringValueProperty({
            uid: 'path',
            label: 'Save path',
            defaultValue: '',
            helpText: 'The file path under which uploaded files will be saved',
            codeHelpText: 'The R function that returns the path from which files will be served',
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
      $('[data-controltype="datadownload"]').click(function () {
        window.RCAP.listFiles(this.id).then(function(response) { 
          if(response.status.toLowerCase() === 'success') {
            PubSub.publish(pubSubTable.showDataDownloadDialog, response.data);
          }
        });
      });
    }
  });

  return DataUploadControl;


});
