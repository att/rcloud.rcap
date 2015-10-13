define(['rcap/js/ui/controls/gridControl', 'text!rcap/partials/dialogs/_formBuilder.htm'], function(GridControl, tpl) {

    'use strict';

    var FormControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'form',
                label: 'Form',
                icon: 'list-alt',
                initialSize: [2, 1],
                controlProperties: [
                    // TODO : general form properties!
                ]
            });

            this.childControls = [
                // initially empty, will be modified by the user
            ];
        },
        render: function(options) {

            var html = '<div id="' + this.id + '" class="rcap-form">';

            $.each(this.childControls, function(key, child) {
                html += '<div class="form-group">';
                html += child.render(options);
                html += '</div>';
            });

            html += '</div>';

            return html;

        },
        getDialogMarkup: function() {
            return tpl;
        },
        toJSON: function() {
            return {
                'type': this.type,
                'x': this.x,
                'y': this.y,
                'width': this.width,
                'height': this.height,
                'id': this.id,
                'controlProperties': this.controlProperties,
                'childControls': this.childControls
            };
        },
        isValid: function() {
            // ensure that the 'invalid' item count is 0:
            return _.filter(this.controlProperties, function(p) {
                    return p.isRequired && (typeof p.value === 'undefined' || p.value.length === 0);
                }).length === 0 &&
                (_.filter(this.childControls, function(cp) {
                    return cp.isRequired && (typeof cp.value === 'undefined' || cp.value.length === 0);
                }).length === 0) && this.childControls.length > 0;
        },
        initialiseViewerItems: function() {

            //$('#' + this.id).find('.rcap-form [data-variablename]').change(function() { 

            $('[data-variablename]').change(function() {

                var data = {
                    variableName: $(this).attr('data-variablename'),
                    value: $(this).val()
                };

                var notebookResult = window.notebook_result; // jshint ignore:line
                if (notebookResult) {
                    notebookResult.updateVariable(data);
                } else {
                    console.log('window.notebook_result is not available, so logging to console: ', data);    
                }
               
            });

        }
    });

    return FormControl;

});
