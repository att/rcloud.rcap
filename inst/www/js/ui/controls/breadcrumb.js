define(['rcap/js/ui/controls/gridControl',
        'rcap/js/ui/properties/textProperty',
        'rcap/js/ui/properties/colorProperty',
        'pubsub',
        'site/pubSubTable',
        'rcap/js/utils/pageWalker'
    ],
    function(GridControl, TextProperty, ColorProperty, PubSub, pubSubTable, PageWalker) {

        'use strict';

        var renderControl = function(control, publishEvent) {

            if (control.currentPageID) {
                var items = new PageWalker(control.pages).getAncestorsAndSelf(control.currentPageID);

                // publish the required event if required; if render method has been called
                // directly, let its caller handle the returned markup, otherwise fire the
                // event:
                if (publishEvent) {
                    // this 'updateControl' is for visual invalidation only;
                    // doesn't mean that dirty state should be set to true:
                    control.isDirty = false;
                    PubSub.publish(pubSubTable.updateControl, control);

                } else {
                    var templateStr = '<div <% if(controlProperties[2].value) { %>style="color:<%=controlProperties[2].value%>"<%}%> class="rcap-breadcrumb"><% if(controlProperties[0].value) { %><span class="prefix"><%=controlProperties[0].value%></span><% } %><% _.each(items, function(i){ %><% if(i.id === items[items.length - 1].id) { %><span <% if(controlProperties[3].value) { %>style="color:<%=controlProperties[3].value%>"<%}%>><%= i.navigationTitle %></span><% } else { %><a <% if(controlProperties[1].value) { %>style="color:<%=controlProperties[1].value%>"<%}%> href="javascript:void(0)" data-pageid="<%=i.id%>" data-href="<%=i.navigationTitle%>"><%=i.navigationTitle%></a><span <% if(controlProperties[2].value) { %>style="color:<%=controlProperties[2].value%>"<%}%> class="separator">></span><% } %><% }); %></div>';
                    var template = _.template(templateStr);
                    return template({
                        items: items,
                        controlProperties: control.controlProperties
                    });
                }
            } else {
                return '<div class="rcap-breadcrumb"><!-- content replaced dynamically --></div>';
            }
        };

        var BreadcrumbControl = GridControl.extend({
            init: function() {
                this._super({
                    type: 'breadcrumb',
                    controlCategory: 'Navigation',
                    label: 'Breadcrumb',
                    icon: 'ellipsis-horizontal',
                    controlProperties: [
                        new TextProperty({
                            uid: 'textPrefix',
                            label: 'Prefix',
                            defaultValue: 'You are here: ',
                            helpText: 'A helpful text prefix for the breadcrumb',
                            isRequired: false
                        }),
                        new ColorProperty({
                            uid: 'linkColor',
                            label: 'Link color',
                            helpText: '',
                            defaultValue: '#336699'
                        }),
                        new ColorProperty({
                            uid: 'separatorColor',
                            label: 'Separator color',
                            helpText: '',
                            defaultValue: '#666666'
                        }),
                        new ColorProperty({
                            uid: 'currentPageColor',
                            label: 'Current page color',
                            helpText: '',
                            defaultValue: '#111111'
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
                PubSub.subscribe(pubSubTable.pageAdded, function(/*msg, msgData*/) {

                    if (me.isOnGrid) {
                        renderControl(me, true);
                    }
                });

                //////////////////////////////////////////////////////////////////////////////////////////
                //
                //
                //
                PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                    if (me.isOnGrid) {

                        // update the page's details:
                        var page = _.findWhere(me.pages, {
                            id: pageObj.id
                        });

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
                PubSub.subscribe(pubSubTable.pageMoved, function(/*msg, movedPageDetails*/) {

/*
                    if (me.isOnGrid) {

                        // update the page's details:
                        var page = _.findWhere(me.pages, {
                            id: pageObj.id
                        });

                        page.navigationTitle = pageObj.navigationTitle;
                        page.isEnabled = pageObj.isEnabled;

                        me.currentPageID = pageObj.id;

                        renderControl(me, true);
                    }
*/
                    if(me.isOnGrid) {
                      renderControl(me, true);
                    }

                });

                //////////////////////////////////////////////////////////////////////////////////////////
                //
                //
                //
                PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                    if (me.isOnGrid) {

                        me.pages = new PageWalker(me.pages).removePage(pageId);

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

                        console.info('pagesChanged event handler breadcrumb for: ', me.id);

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
                        //me.currentPageID = me.pages.length > 0 ? me.pages[0].id : '';
                        me.currentPageID = initInfo.site.currentPageID;

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

                $('#rcap-viewer').on('click', '.rcap-breadcrumb a', function() {
                    // get the nav title:
                    location.hash = $(this).data('href');
                    PubSub.publish(pubSubTable.changeSelectedPageByTitle, $(this).data('href'));
                });

            }
        });

        return BreadcrumbControl;

    });
