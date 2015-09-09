define(['rcap/js/ui/controls/gridControl', 'text!rcap/partials/dialogs/_formBuilder.htm'], function(GridControl, tpl) {

    'use strict';

    var FormControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'form',
                label: 'Form',
                icon: 'f022',
                inlineIcon: 'list-alt',
                initialSize: [2, 2],
                controlProperties: [
                	// TODO : general form properties!
                ]
            });

            this.childControls = [
                // initially empty, will be modified by the user
            ];
        },
        render: function(options) {
          
            var html = '';

            $.each(this.childControls, function(key, child) {
                html += '<div class="form-group">';
                html += child.render(options);
                html += '</div>';
            });

            return html;

        },
        getDialogMarkup: function() {
        	return tpl;
        },
        toJSON : function() {
            return {
                'type' : this.type,
                'x' : this.x,
                'y' : this.y,
                'width' : this.width,
                'height' : this.height,
                'id' : this.id,
                'controlProperties' : this.controlProperties,
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
        }
    });

    return FormControl;

});