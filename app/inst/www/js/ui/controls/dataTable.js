define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/dataTable.tpl'

], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Data',
                label: 'Data Table',
                icon: 'table',
                initialSize: [2, 2],
                controlProperties: [
                    new TextControlProperty({
                        uid: 'variablename',
                        label: 'Variable name',
                        defaultValue: 'variable',
                        helpText: 'The variable associated with this control',
                        isRequired: false
                    }),
                    new AutocompleteControlProperty({
                        uid: 'source',
                        label: 'Source',
                        defaultValue: '',
                        helpText: 'The R Function that assigns the data',
                        isRequired: false
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

    return DataTableControl;

});