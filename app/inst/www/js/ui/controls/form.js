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

            var html = '<form action=""><div id="' + this.id + '" class="rcap-form">';

            $.each(this.childControls, function(key, child) {
                html += '<div class="form-group">';
                html += child.render(options);
                html += '</div>';
            });

            html += '</div></form>';

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

            var data;

            var getVarData = function(el) {
                return {
                    variableName: el.attr('data-variablename'),
                    value: el.val()
                };
            };

            var submitVariableChange = function(data) {
                var notebookResult = window.notebook_result; // jshint ignore:line
                if (notebookResult) {
                    notebookResult.updateVariable(data);
                } else {
                    console.log('window.notebook_result is not available, varchange data is: ', JSON.stringify(data));
                }
            };

            // if a form has a submit button, its data will be submitted when the form is submitted.
            // otherwise, the individual control will submit data following a change:
            $('.rcap-controltype-form').each(function() {
                if ($(this).find('input[type="submit"]')) {
                    $(this).find('form').submit(function(e) {

                        e.preventDefault();

                        // loop through each item:
                        data = [];
                        $(this).find('[data-variablename]').each(function() {
                            data.push(getVarData($(this)));
                        });

                        submitVariableChange(data);
                    });
                } else {
                    $('[data-variablename]').change(function() {
                        submitVariableChange([
                            getVarData($(this))
                        ]);
                    });
                }
            });
        }
    });

    return FormControl;

});
