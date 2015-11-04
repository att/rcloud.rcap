define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/ui/controls/properties/colorControlProperty',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/utils/pageWalker',
    'text!controlTemplates/pageMenu.tpl'
], function(GridControl, DropdownControlProperty, ColorControlProperty, PubSub, pubSubTable, PageWalker, tpl) {

    'use strict';

    var renderControl = function(control, publishEvent) {

        // publish the required event if required; if render method has been called
        // directly, let its caller handle the returned markup, otherwise fire the 
        // event:
        if (publishEvent) {
            PubSub.publish(pubSubTable.updateControl, control);
        } else {

            if (['horizontal', 'vertical'].indexOf(control.controlProperties[0].value) !== -1) {
                var template = _.template(tpl),
                    markup = template({
                        control: control
                    });

                return markup;
            } else {

                var hamburgerTemplate =
                    $('<nav class="hamburger hamburger-valign-' + control.controlProperties[1].value + '"><button>Toggle</button><div></div></nav>');

                var buildTree = function(pages) {
                    _.each(pages, function(page) {

                        var template = _.template('<div data-pageid="<%=p.id%>"><a style="padding-left:<%=((p.depth - 1) * 20) + 15%>px" href="javascript:void(0)" data-ishamburger="true" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></div>');
                        var markup = template({
                            p: page
                        });

                        if (page.isEnabled) {

                            if(page.parentId) {
                                // this is a child page
                                hamburgerTemplate.find('div[data-pageid="' + page.parentId + '"]').append(markup);
                            } else {
                                hamburgerTemplate.find('> div').append(markup);
                            }
                           
                        }

                        // if (page.pages) {
                        //     buildTree(page.pages);
                        // }
                    });
                };

                buildTree(control.pages);

                return hamburgerTemplate[0].outerHTML;
            }
        }
    };

    var PageMenuControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'pagemenu',
                label: 'Page Menu',
                icon: 'reorder',
                initialSize: [2, 1],
                controlProperties: [
                    new DropdownControlProperty({
                        uid: 'menustyle',
                        label: 'Menu Style',
                        helpText: 'The visual style of the menu',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Mobile Style \'Hamburger icon\'',
                            value: 'hamburger'
                        }/*, {
                            text: 'Horizontal',
                            value: 'horizontal'
                        }, {
                            text: 'Vertical',
                            value: 'vertical'
                        }*/],
                        value: 'hamburger'
                    }),
                    // new DropdownControlProperty({
                    //     uid: 'horizontalalignment',
                    //     label: 'Horizontal Alignment',
                    //     isRequired: true,
                    //     availableOptions: [{
                    //         text: 'Left',
                    //         value: 'left'
                    //     }, {
                    //         text: 'Center',
                    //         value: 'center'
                    //     }, {
                    //         text: 'Right',
                    //         value: 'right'
                    //     }]
                    // }),
                    new DropdownControlProperty({
                        uid: 'verticalalignment',
                        label: 'Vertical Alignment',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Top',
                            value: 'top'
                        }, {
                            text: 'Middle',
                            value: 'middle'
                        }, {
                            text: 'Bottom',
                            value: 'bottom'
                        }],
                        value: 'middle'
                    }),
                    /*
                                        new ColorControlProperty({
                                            uid: 'linkColor',
                                            label: 'Link color',
                                            helpText: 'The color of the menu links'
                                        }),
                                        new ColorControlProperty({
                                            uid: 'backgroundColor',
                                            label: 'Link background color',
                                            helpText: 'The background color of the menu links'
                                        }),
                                        new ColorControlProperty({
                                            uid: 'hoverBackgroundColor',
                                            label: 'Link hover background color',
                                            helpText: 'The hover background color of the menu links'
                                        }),
                                        new ColorControlProperty({
                                            uid: 'selectedBackgroundColor',
                                            label: 'Link selected background color',
                                            helpText: 'The selected background color of the menu links'
                                        })*/
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
            PubSub.subscribe(pubSubTable.pageAdded, function(/*msg, msgData*/) {

                if (me.isOnGrid) {

                    // if the page doesn't already exist:
                   // if (!_.find(me.pages, function(p) {
                       //     return p.id === msgData.page.id;
                       // })) {
                        

                        renderControl(me, true);
                  //  }

                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                if (me.isOnGrid) {

                    // update the page's details:
                    var page = _.findWhere(me.pages, { id : pageObj.id });

                    page.navigationTitle = pageObj.navigationTitle;
                    page.isEnabled = pageObj.isEnabled;

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

                    me.pages = new PageWalker(me.pages).deletePage(pageId);

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

            $('.hamburger, .rcap-pagemenu').closest('.grid-stack-item').css('z-index', '1');

            $('#rcap-viewer').on('click', '.rcap-pagemenu a, .hamburger a', function() {
                // get the nav title:
                location.hash = $(this).data('href');
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, $(this).data('href'));

                if ($(this).attr('data-ishamburger') === 'true') {
                    $(this).toggleClass('expanded').siblings('div').slideToggle({
                        duration: 200
                    });
                }
            });

            $('#rcap-viewer').on('click', '.hamburger button', function() {
                $(this).toggleClass('expanded').siblings('div').slideToggle({
                    duration: 200
                });

                $(this).closest('.grid-stack-item-content').css({
                    'overflow-x': 'visible',
                    'overflow-y': 'visible'
                });

            });
        },
    });

    return PageMenuControl;

});
