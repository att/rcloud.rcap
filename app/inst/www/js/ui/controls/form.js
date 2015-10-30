define(['rcap/js/ui/controls/gridControl', 'text!rcap/partials/dialogs/_formBuilder.htm', 'rcap/js/ui/controls/properties/colorControlProperty'], function(GridControl, tpl, ColorControlProperty) {

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

            // additional property specifically for forms:
            this.styleProperties.push(
                new ColorControlProperty({
                    uid: 'labelColor',
                    label: 'Label Color',
                    helpText: '',
                    defaultValue: '#000000',
                    value: '#000000'
                }));
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
        getStyleProperties: function() {
            var styleInfo = this._super();
            styleInfo.color = this.getStylePropertyByName('labelColor').value;

            return styleInfo;
        },
        toJSON: function() {
            var json = this._super();
            json.childControls = this.childControls;
            return json;
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

                // value dependent on control type:
                var value;

/*
                if( el.data('select2')) {
                    value = _.pluck(el.select2('data'), 'text');
                } else if( el.is('select')) {
                    value = el.find('option:selected').val();
                } else */

                if( el.hasClass('checkbox-group')) {
                    // get all selected checkboxes:
                    value = [];
                    el.find('input:checkbox:checked').each(function() 
                    {
                       value.push($(this).val());
                    });

                } else if( el.hasClass('radiobutton-group')) {
                    // get selected radio button:
                    value = el.find('input:checked').val();
                } else {
                    // either a checkbox list, radio buttons, or something 
                    // that we can use val() with:
                    value = el.val();
                }

                return {
                    variableName: el.attr('data-variablename'),
                    controlId: el.attr('id'),
                    value: value
                };
            };

            var submitVariableChange = function(data) {
                // var notebookResult = window.notebook_result; // jshint ignore:line
                // if (notebookResult) {
                //     notebookResult.updateVariable(data);
                // } else {
                //     console.log('window.notebook_result is not available, varchange data is: ', JSON.stringify(data));
                // }

                console.log('Submitting data: ', JSON.stringify(data));
            };

            // if a form has a submit button, its data will be submitted when the form is submitted.
            // otherwise, the individual control will submit data following a change:
            $('.rcap-controltype-form').each(function() {
                if ($(this).find('input[type="submit"]').length > 0) {
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
                    $(this).find('[data-variablename]').change(function() {
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
