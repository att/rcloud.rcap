define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/pageMenu.tpl'
], function(GridControl, DropdownControlProperty, PubSub, pubSubTable, tpl) {

    'use strict';

    var renderControl = function(control, pages, currentPageID, publishEvent) {

        var template = _.template(tpl),
            markup = template({
                pages: pages,
                currentPageID: currentPageID
            });

        // publish the required event if required; if render method has been called
        // directly, let its caller handle the returned markup, otherwise fire the 
        // event:
        if (publishEvent) {
            PubSub.publish(pubSubTable.updateControl, control);
        } else {
            return markup;
        }
    };

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

            // this will be manipulated by various event subscriptions
            this.pages = [];
            this.currentPageID = undefined;

            var me = this;

            //////////////////////////////////////////////////////////////////////////////////
            //
            //  viewer event
            //
            PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {

                if (me.isOnGrid) {
                    me.currentPageID = page.id;
                    renderControl(me, me.pages, page.id, true);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // viewer/designer event:
            //
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                if (me.isOnGrid) {
                    me.pages = site.pages;
                    me.currentPageID = site.currentPageID;

                    renderControl(me, me.pages, site.currentPageID, true);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////
            //
            //  designer events
            //

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

                if (me.isOnGrid) {

                    // if the page doesn't already exist:
                    if (!_.find(me.pages, function(p) {
                            return p.id === page.id;
                        })) {
                        //console.log('pageMenu control : adding page with id ' + page.id);

                        me.pages.push(page);
                        me.currentPageID = page.id;

                        renderControl(me, me.pages, page.id, true);
                    }

                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                if (me.isOnGrid) {

                    // update the page's details:
                    _.findWhere(me.pages, {
                        id: pageObj.id
                    }).navigationTitle = pageObj.navigationTitle;

                    me.currentPageID = pageObj.id;

                    renderControl(me, me.pages, pageObj.id, true);
                }

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                if (me.isOnGrid) {
                    me.pages = _.without(me.pages, _.findWhere(me.pages, {
                        id: pageId
                    }));

                    me.currentPageID = me.pages.length > 0 ? me.pages[0].id : '';

                    renderControl(me, me.pages, me.currentPageID, true);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pagesChanged, function(msg, pagesInfo) {

                if (me.isOnGrid) {

                    // verify that the pages' order has actually changed:
                    if (_.pluck(me.pages, 'id').join() !== _.pluck(pagesInfo.pages, 'id').join()) {
                        me.pages = pagesInfo.pages;
                        me.currentPageID = me.pages.length > 0 ? me.pages[0].id : '';
                        renderControl(me, me.pages, me.currentPageID, true);
                    }
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.gridItemAddedInit, function(msg, initInfo) {

                // ensure this is only picked up by the specific control
                // in the initInfo parameter:
                if (me.isOnGrid && me.id === initInfo.controlID) {
                    // this should only be published if it is on a grid, but be cautious nonetheless:
                    me.pages = initInfo.site.pages;
                    me.currentPageID = me.pages.length > 0 ? me.pages[0].id : '';

                    // and render:
                    renderControl(me, me.pages, me.currentPageID, true);
                }

            });

        },
        render: function() {

            // don't publish an update event:
            return renderControl(this, this.pages, this.currentPageID, false);

        }
    });

    return PageMenuControl;

});





/*
define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/pageMenu.tpl'
], function(GridControl, DropdownControlProperty, PubSub, pubSubTable, tpl) {

    'use strict';

    var renderControl = function(controlID, pages, currentPageID) {

        var template = _.template(tpl);

        //console.log('pageMenu CONTROL : about to publish *updateControlMarkup*');

        // publish the required event:
        PubSub.publish(pubSubTable.updateControlMarkup, {
            controlId: controlID,
            markup: template({
                pages: pages,
                currentPageID: currentPageID
            })
        });

    };

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

            // this will be manipulated by various event subscriptions
            this.pages = [];

            var me = this;

            //////////////////////////////////////////////////////////////////////////////////
            //
            //  viewer event
            //
            PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {

                if (me.isOnGrid) {
                    renderControl(me.id, me.pages, page.id);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // viewer/designer event:
            //
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                if (me.isOnGrid) {
                    me.pages = site.pages;

                    renderControl(me.id, me.pages, site.currentPageID);
                }
            });

            //////////////////////////////////////////////////////////////////////////////////
            //
            //  designer events
            //

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

                if (me.isOnGrid) {

                    // if the page doesn't already exist:
                    if (!_.find(me.pages, function(p) {
                            return p.id === page.id;
                        })) {
                        //console.log('pageMenu control : adding page with id ' + page.id);

                        me.pages.push(page);

                        renderControl(me.id, me.pages, page.id);
                    }

                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                if (me.isOnGrid) {

                    // update the page's details:
                    _.findWhere(me.pages, {
                        id: pageObj.id
                    }).navigationTitle = pageObj.navigationTitle;

                    renderControl(me.id, me.pages, pageObj.id);
                }

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                if (me.isOnGrid) {
                    me.pages = _.without(me.pages, _.findWhere(me.pages, {
                        id: pageId
                    }));

                    renderControl(me.id, me.pages, me.pages.length > 0 ? me.pages[0].id : '');
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pagesChanged, function(msg, pagesInfo) {

                if (me.isOnGrid) {

                    // verify that the pages' order has actually changed:
                    if (_.pluck(me.pages, 'id').join() !== _.pluck(pagesInfo.pages, 'id').join()) {
                        me.pages = pagesInfo.pages;
                        renderControl(me.id, me.pages, me.pages.length > 0 ? me.pages[0].id : '');
                    }
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.gridItemAddedInit, function(msg, initInfo) {

                // ensure this is only picked up by the specific control
                // in the initInfo parameter:
                if(me.isOnGrid && me.id === initInfo.controlID) {
                    // this should only be published if it is on a grid, but be cautious nonetheless:
                    me.pages = initInfo.site.pages;

                    // and render:
                    renderControl(me.id, me.pages, me.pages.length > 0 ? me.pages[0].id : '');
                }

            });

        },
        render: function() {
            return '*';
        }
    });

    return PageMenuControl;

});
*/
