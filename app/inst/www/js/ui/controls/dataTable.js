define(['rcap/js/ui/controls/gridControl', 
    'text!controlTemplates/dataTable.tpl'

], function(GridControl, tpl) {

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