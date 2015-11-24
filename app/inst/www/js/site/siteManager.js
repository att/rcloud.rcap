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
            PubSub.subscribe(pubSubTable.addPage, function(msg, options) {

                console.info('siteManager: pubSubTable.addPage');

                var site = getSite();
                var newPage = site.createPage(options);

                site.pages.push(newPage);
                
                site.currentPageID = newPage.id;
                setSite(site);

                // let interested parties know that a page has been added:
                PubSub.publish(pubSubTable.pageAdded, {
                    pageData: [newPage]//,
                    //options: options
                });

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

                PubSub.publish(pubSubTable.changeSelectedPageId, site.currentPageID);
            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.duplicatePageConfirm, function(msg, pageId) {

                console.info('siteManager: pubSubTable.duplicatePageConfirm');

                var site = getSite();
                var newPages = site.duplicatePage(pageId);

                // duplicate page doesn't return this, but does add a page, so reset:
                setSite(site);

                PubSub.publish(pubSubTable.pageAdded, {
                    pageData: newPages//,
                    // options: { 
                    //     // this is already present in the new page,
                    //     // but is passed separately for DRY on message receiver:
                    //     parentPageId : newPage.parentId 
                    // }
                });

                PubSub.publish(pubSubTable.pagesChanged, {
                    pages: site.pages,
                    currentPageID: newPages[0].id
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
                var site = getSite(),
                    currentPage;

                if (pageTitle.length === 0) {

                    // no page, so show them the first page:
                    currentPage = site.getFirstPage();

                } else {

                    // and find the page by it's navigation title:
                    currentPage = site.getPageByNavigationTitle(pageTitle);
                }

                // evaluate currentPage, which may be undefined:
                if (currentPage) {
                    site.currentPageID = currentPage.id;

                    // fire off the specific page:
                    PubSub.publish(pubSubTable.changeSelectedPage, currentPage);
                } else {
                    PubSub.publish(pubSubTable.show404, {
                        site: site,
                        requestedPage: pageTitle
                    });
                }

            });

            ////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pageSettingsClicked, function(msg, pageId) {

                console.info('siteManager: pubSubTable.pageSettingsClicked');

                var site = getSite();

                // for validation purposes, get the current list of page navigation titles:
                PubSub.publish(pubSubTable.showPageSettingsDialog, {
                    page : site.getPageByID(pageId),
                    currentPageNavigationTitles : site.getPageNavigationTitles(),
                    canDelete : site.canDeletePage(pageId)
                });
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

            ////////////////////////////////////////////////////////////////////////////////////
            //
            // data sources
            //
            PubSub.subscribe(pubSubTable.addDataSource, function() {

                console.info('siteManager: pubSubTable.addDataSource');

                var site = getSite();
                var newDataSource = site.createDataSource();
                site.dataSources.push(newDataSource);

                setSite(site);

                // let interested parties know that a data source has been added:
                PubSub.publish(pubSubTable.dataSourceAdded, newDataSource);
            });

            PubSub.subscribe(pubSubTable.deleteDataSourceConfirm, function(msg, dataSourceId) {

                console.info('siteManager: pubSubTable.deleteDataSourceConfirm');

                var site = getSite().deleteDataSource(dataSourceId);

                setSite(site);
            });

            PubSub.subscribe(pubSubTable.dataSourceSettingsClicked, function(msg, id) {

                console.info('siteManager: pubSubTable.dataSourceSettingsClicked');

                var site = getSite();

                PubSub.publish(pubSubTable.showDataSourceSettingsDialog, site.getDataSourceByID(id));
            });

            PubSub.subscribe(pubSubTable.updateDataSource, function(msg, dataSourceObj) {

                console.info('siteManager: pubSubTable.updateDataSource');

                setSite(getSite().updateDataSource(dataSourceObj));
            });
        }
    });

    return SiteManager;

});
