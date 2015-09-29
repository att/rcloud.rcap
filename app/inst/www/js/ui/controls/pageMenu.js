define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'pubsub',
    'site/pubSubTable',
    'text!controlTemplates/pageMenu.tpl'
], function(GridControl, DropdownControlProperty, PubSub, pubSubTable, tpl) {

    'use strict';

    var renderControl = function(control, publishEvent) {

        // publish the required event if required; if render method has been called
        // directly, let its caller handle the returned markup, otherwise fire the 
        // event:
        if (publishEvent) {
            PubSub.publish(pubSubTable.updateControl, control);
        } else {

            var template = _.template(tpl),
                markup = template({
                    control: control
                });

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
                            text: 'Mobile Style \'Hamburger icon\'',
                            value: 'hamburger'
                        }, {
                            text: 'Horizontal',
                            value: 'horizontal'
                        }, {
                            text: 'Vertical',
                            value: 'vertical'
                        }]
                    }),
                    new DropdownControlProperty({
                        uid: 'alignment',
                        label: 'Alignment',
                        helpText: 'The menu alignment',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Left',
                            value: 'left'
                        }, {
                            text: 'Center',
                            value: 'center'
                        }, {
                            text: 'Right',
                            value: 'right'
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
                    renderControl(me, true);
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

                    renderControl(me, true);
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

                        renderControl(me, true);
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

                    renderControl(me, true);
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

                    renderControl(me, true);
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
                        renderControl(me, true);
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
                    renderControl(me, true);
                }

            });

        },
        render: function() {

            // don't publish an update event since this is being called directly:
            return renderControl(this, false);

        },
        initialiseViewerItems: function() {

            // $('.menu-btn').click(function() {
            //     $('.responsive-menu').toggleClass('expand');
            // });

            $('#rcap-viewer').on('click', '.rcap-pagemenu a, .hamburger a', function() {
                // get the nav title:
                location.hash = $(this).data('href');
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, $(this).data('href'));
            });

            $('#rcap-viewer').on('click', '.hamburger button', function() {
                $(this).toggleClass('expanded').siblings('div').slideToggle({
                    duration: 200
                });

                $(this).closest('.grid-stack-item-content').css({
                    'overflow-x' : 'visible',
                    'overflow-y' : 'visible'
                });
            });
        },
    });

    return PageMenuControl;

});
