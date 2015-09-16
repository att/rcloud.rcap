define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'text!controlTemplates/pageMenu.tpl'

], function(GridControl, DropdownControlProperty, tpl) {

    'use strict';

    var PageMenuControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'pagemenu',
                label: 'Page Menu',
                icon: 'f0c9',
                inlineIcon: 'reorder',
                initialSize: [2, 2],
                controlProperties: [
                    new DropdownControlProperty({
                        uid: 'menustyle',
                        label: 'Menu Style',
                        helpText: 'The visual style of the menu',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Hamburger',
                            value: 'hamburger'
                        }, {
                            text: 'Horizontal',
                            value: 'horizontal'
                        }, {
                            text: 'Vertical',
                            value: 'vertical'
                        }]
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

    return PageMenuControl;

});
