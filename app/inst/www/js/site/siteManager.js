define([
    'pubsub',
    'site/pubSubTable',
   // 'site/site'
], function(PubSub, pubSubTable/*, Site*/) {

    'use strict';

    var el = '#rcap-designer';

    // get the site:
    var getSite = function() {
        return $(el).data('site');
    };

    // set the site:
    var setSite = function(site) {
        $(el).data('site', site);
    };

    var SiteManager = Class.extend({
        init: function() {
            // create a new site:
            //this.site = new Site();
        },
        initialise: function() {

            //setSite(this.site);

            // subscribe:
            // PubSub.subscribe('pubSubTable.initSite', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.designerInit', function(msg, data) {

            // });

            PubSub.subscribe(pubSubTable.save, function() {

                console.info('siteManager: pubSubTable.save');

                PubSub.publish(pubSubTable.serialize, getSite());
            });

            // PubSub.subscribe('pubSubTable.load', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.close', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.deserialize', function(msg, data) {

            // });

            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                console.info('siteManager: pubSubTable.initSite');

                setSite(site);
            });

            PubSub.subscribe(pubSubTable.gridItemAdded, function(msg, item) {

                console.info('siteManager: pubSubTable.gridItemAdded');

                var site = getSite();
                setSite(site.addControl(item));
            });

            PubSub.subscribe(pubSubTable.gridItemsChanged, function(msg, items) {

                console.info('siteManager: pubSubTable.gridItemsChanged');

                // set the current page's items:
                var site = getSite();
                setSite(site.setCurrentPageControls(items));
            });

            PubSub.subscribe(pubSubTable.addPage, function(/*msg, data*/) {

                console.info('siteManager: pubSubTable.addPage');

                var site = getSite();
                var newPage = site.createPage();

                site.addPage(newPage);
                site.currentPageID = newPage.id;
                setSite(site);
                
                // let interested parties know that a page has been added:
                PubSub.publish('ui:' + pubSubTable.addPage, newPage);
            });

            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                console.info('siteManager: pubSubTable.updatePage');

                setSite(getSite().updatePage(pageObj));
            });

            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                console.info('siteManager: pubSubTable.deletePageConfirm');

                setSite(getSite().deletePage(pageId));
            });

            PubSub.subscribe(pubSubTable.changeSelectedPageId, function(msg, pageId) {

                console.info('siteManager: pubSubTable.changeSelectedPageId');

                // update the site's current page:
                var site = getSite();
                site.currentPageID = pageId;

                // fire off the specific page:
                PubSub.publish(pubSubTable.changeSelectedPage, getSite().getPageByID(pageId));
            });

            PubSub.subscribe(pubSubTable.pageSettingsClicked, function(msg, pageId) {

                console.info('siteManager: pubSubTable.pageSettingsClicked');

                PubSub.publish(pubSubTable.showPageSettingsDialog, getSite().getPageByID(pageId));
            });

            PubSub.subscribe(pubSubTable.changePageOrder, function(msg, pageIds) {

                console.info('siteManager: pubSubTable.changePageOrder');

                var site = getSite();
                setSite(site.updatePageOrder(pageIds));

            });

            // PubSub.subscribe('pubSubTable.gridInitComplete', function(msg, data) {

            // });

            // PubSub.subscribe('pubSubTable.addControl', function(msg, data) {

            // });

            PubSub.subscribe(pubSubTable.updateControl, function(msg, control) {

                console.info('siteManager: pubSubTable.updateControl');

                var site = getSite();
                setSite(site.updateControl(control));
            });

            PubSub.subscribe(pubSubTable.deleteControlConfirm, function(msg, controlID) {

                console.log('siteManager: pubSubTable.deleteControlConfirm');

                var site = getSite();
                setSite(site.deleteControl(controlID));
            });
        }
    });

    return SiteManager;

});