define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/pageMenu.tpl'
], function(GridControl, DropdownControlProperty, PubSub, pubSubTable, tpl) {

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
                ],
                renderEvents: [pubSubTable.addPage, pubSubTable.deletePageConfirm, pubSubTable.initSite]
            });
        },
        render: function(options) {

            options = options || {};

            var isDesignTime = options.isDesignTime || false,
                template = _.template(tpl);

            if (isDesignTime) {
                return template({
                    pages: [{
                        navigationTitle: 'Page 1',
                        id: '1'
                    }, {
                        navigationTitle: 'Page 2',
                        id: '2'
                    }],
                    siteCurrentPageID: '1'
                });
            } else {

                var rcap = JSON.parse(localStorage.getItem('rcap'));

                return template({
                    pages: rcap.pages,
                    siteCurrentPageID: rcap.pages !== undefined && rcap.pages.length > 0 ? rcap.pages[0].id : ''
                });
            }
        }
    });

    return PageMenuControl;

});
