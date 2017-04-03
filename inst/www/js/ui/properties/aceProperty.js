define(['rcap/js/ui/properties/baseProperty', 'text!templates/ace.tpl'], function(BaseProperty, tpl) {

    'use strict';

    var AceProperty = BaseProperty.extend({
        init: function(options) {
            options = options || {};
            this._super({
                type: 'text',
                label: options.label || '',
                helpText: options.helpText || '',
                defaultValue: options.defaultValue || '',
                isRequired: options.isRequired || false,
                uid: options.uid,
                className: options.className
            });

            this.isHorizontal = _.isUndefined(options.isHorizontal) ? true : options.isHorizontal;
        },
        render: function(childIndex) {

            var template = _.template(tpl);

            return template({
                property: this,
                childIndex: childIndex
            });

        },
        getDialogValue: function() {
            //return $('#' + this.id).val();

            return 'AceProperty.js TODO';
        }
    });

    return AceProperty;

});