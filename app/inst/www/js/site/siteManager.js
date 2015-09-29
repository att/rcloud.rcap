define([
    'pubsub',
    'site/pubSubTable',
    // 'site/site'
], function(PubSub, pubSubTable /*, Site*/ ) {

    'use strict';

    var el = 'body';

    // get the site:
    var getSite = function() {
        return $(el).data('rcap-site');
    };

    // set the site:
    var setSite = function(site) {
        $(el).data('rcap-site', site);
    };

    var SiteManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.save, function() {

                console.info('siteManager: pubSubTable.save');

                var site = getSite();
                site.save();

                PubSub.publish(pubSubTable.serialize, site);
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                console.info('siteManager: pubSubTable.initSite');

                setSite(site);

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: site.currentPageID
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.gridItemAdded, function(msg, item) {

                console.info('siteManager: pubSubTable.gridItemAdded');

                var site = getSite();
                setSite(site.addControl(item));

                // publish an event for the control:
                PubSub.publish(pubSubTable.gridItemAddedInit, {
                    site: site,
                    controlID: item.id
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.gridItemsChanged, function(msg, items) {

                console.info('siteManager: pubSubTable.gridItemsChanged');

                // set the current page's items:
                var site = getSite();
                setSite(site.setCurrentPageControls(items));
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.addPage, function( /*msg, data*/ ) {

                console.info('siteManager: pubSubTable.addPage');

                var site = getSite();
                var newPage = site.createPage();

                site.addPage(newPage);
                site.currentPageID = newPage.id;
                setSite(site);

                // let interested parties know that a page has been added:
                PubSub.publish('ui:' + pubSubTable.addPage, newPage);

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: site.currentPageID
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                console.info('siteManager: pubSubTable.updatePage');

                setSite(getSite().updatePage(pageObj));
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                console.info('siteManager: pubSubTable.deletePageConfirm');

                var site = getSite().deletePage(pageId);

                setSite(site);

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: site.currentPageID
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.changeSelectedPageId, function(msg, pageId) {

                console.info('siteManager: pubSubTable.changeSelectedPageId');

                // update the site's current page:
                var site = getSite();
                site.currentPageID = pageId;

                // fire off the specific page:
                PubSub.publish(pubSubTable.changeSelectedPage, getSite().getPageByID(pageId));

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: site.currentPageID
                });
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.changeSelectedPageByTitle, function(msg, pageTitle) {

                console.info('siteManager: pubSubTable.changeSelectedPageByTitle');

                // update the site's current page:
                var site = getSite();

                // and find the page by it's navigation title:
                var currentPage = site.getPageByNavigationTitle(pageTitle);

                if (currentPage) {
                    site.currentPageID = currentPage.id;

                    // fire off the specific page:
                    PubSub.publish(pubSubTable.changeSelectedPage, currentPage);
                } else {
                    PubSub.publish(pubSubTable.show404, {
                        site : site,
                        requestedPage : pageTitle
                    });
                }

            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pageSettingsClicked, function(msg, pageId) {

                console.info('siteManager: pubSubTable.pageSettingsClicked');

                PubSub.publish(pubSubTable.showPageSettingsDialog, getSite().getPageByID(pageId));
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.changePageOrder, function(msg, pageIds) {

                console.info('siteManager: pubSubTable.changePageOrder');

                var site = getSite();
                setSite(site.updatePageOrder(pageIds));

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: site.currentPageID
                });

            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updateControl, function(msg, control) {

                console.info('siteManager: pubSubTable.updateControl');

                var site = getSite();
                setSite(site.updateControl(control));
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deleteControlConfirm, function(msg, controlID) {

                console.log('siteManager: pubSubTable.deleteControlConfirm');

                var site = getSite();
                setSite(site.deleteControl(controlID));
            });

            // subscribe:
            // PubSub.subscribe('pubSubTable.initSite', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.designerInit', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.load', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.deserialize', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.gridInitComplete', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.addControl', function(msg, data) {

            // });
        }
    });

    return SiteManager;

});
