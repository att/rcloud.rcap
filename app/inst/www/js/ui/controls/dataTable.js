define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'utils/dataTranslators/dataTableTranslator',
    'text!controlTemplates/dataTable.tpl',
    'datatables/jquery.dataTables.min'

], function(GridControl, TextControlProperty, AutocompleteControlProperty, DataTableTranslator, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Dynamic',
                label: 'Data Table',
                icon: 'table',
                initialSize: [2, 2],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'Code',
                        defaultValue: '',
                        helpText: 'The R Function that assigns the data',
                        isRequired: false
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;
            var template = _.template(tpl);
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value) {
                designTimeDescription += 'Function: ' + this.controlProperties[0].value;
            }

            return template({
                control: this,
                isDesignTime: isDesignTime,
                designTimeDescription : designTimeDescription
            });

        },
        updateData : function(controlId, data) {
            // do some stuff!
            var translator = new DataTableTranslator();
            var translatedData = translator.translate(data);

            $('#' + controlId).dataTable(translatedData);

        }
    });

    return DataTableControl;

});