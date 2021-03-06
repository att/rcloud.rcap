define([
  'rcap/js/assetManager',
  'site/profileVariableManager',
  'pubsub',
  'site/pubSubTable',
  'rcap/js/utils/rcapLogger'
], function (AssetManager, ProfileVariableManager, PubSub, pubSubTable, RcapLogger) {

  'use strict';

  var el = 'body';
  var rcapLogger = new RcapLogger();
  var assetManager = new AssetManager();
  var profileManager = new ProfileVariableManager();

  // get the site:
  var getSite = function () {
    return $(el).data('rcap-site');
  };

  // set the site:
  var setSite = function (site) {
    $(el).data('rcap-site', site);
  };

  var SiteManager = Class.extend({
    init: function () {

    },
    initialise: function () {

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.save, function () {

        rcapLogger.info('siteManager: pubSubTable.save');

        var site = getSite();
        site.save();

        PubSub.publish(pubSubTable.serialize, site);
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.closeDesigner, function () {

        rcapLogger.info('siteManager: pubSubTable.save');

        var site = getSite();

        if (site.isModified()) {
          PubSub.publish(pubSubTable.showConfirmDialog, {
            heading: 'Quit without saving?',
            message: 'You have made changes since your last save. Are you sure you wish to quit and lose your changes?',
            pubSubMessage: pubSubTable.closeDesignerConfirm
          });
        } else {
          // just go straight ahead:
          PubSub.publish(pubSubTable.closeDesignerConfirm);
        }
      });

      PubSub.subscribe(pubSubTable.setModified, function () {
        rcapLogger.info('siteManager: pubSubTable.setModified');
        var site = getSite();
        site.setModified();
      });

      PubSub.subscribe(pubSubTable.clearModified, function () {
        rcapLogger.info('siteManager: pubSubTable.clearModified');
        var site = getSite();
        site.clearModified();
      });


      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.initSite, function (msg, site) {

        rcapLogger.info('siteManager: pubSubTable.initSite');

        setSite(site);

        PubSub.publish(pubSubTable.pagesChanged, {
          pages: site.pages,
          currentPageID: site.currentPageID
        });

        var themeUrl = assetManager.getThemeUrl(site.isDesignTime, site.themeExists);
        if (themeUrl) {
          PubSub.publish(pubSubTable.updateDomTheme, themeUrl);
        }

        if(!site.isDesignTime) {
          PubSub.publish(pubSubTable.gridSettingsUpdated, site.getSettings().getSettingValue('gridControlPadding'));

          var profileVariables = getSite().getProfileVariables();
          profileManager.isProfileVariableDataStale(profileVariables).then(function(staleDataExists) {
            if(staleDataExists) {
              PubSub.publish(pubSubTable.showViewerProfileDialog, profileVariables);
            }
          });
        }
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.gridItemAdded, function (msg, item) {

        rcapLogger.info('siteManager: pubSubTable.gridItemAdded');

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
      PubSub.subscribe(pubSubTable.gridItemsChanged, function (msg, items) {

        rcapLogger.info('siteManager: pubSubTable.gridItemsChanged');

        // set the current page's items:
        var site = getSite();
        setSite(site.setCurrentPageControls(items));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.addPage, function (msg, options) {

        rcapLogger.info('siteManager: pubSubTable.addPage');

        var site = getSite();
        var newPage = site.createPage(options);

        site.pages.push(newPage);

        site.currentPageID = newPage.id;
        setSite(site);

        // let interested parties know that a page has been added:
        PubSub.publish(pubSubTable.pageAdded, {
          pageData: [newPage] //,
          //options: options
        });

        PubSub.publish(pubSubTable.pagesChanged, {
          pages: site.pages,
          currentPageID: site.currentPageID
        });

        PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.updatePage, function (msg, pageObj) {

        rcapLogger.info('siteManager: pubSubTable.updatePage');

        setSite(getSite().updatePage(pageObj));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.deletePageConfirm, function (msg, pageId) {

        rcapLogger.info('siteManager: pubSubTable.deletePageConfirm');

        var site = getSite().deletePage(pageId);

        setSite(site);

        PubSub.publish(pubSubTable.pagesChanged, {
          pages: site.pages,
          currentPageID: site.currentPageID
        });

        PubSub.publish(pubSubTable.changeSelectedPageId, site.currentPageID);

        PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.duplicatePageConfirm, function (msg, pageId) {

        rcapLogger.info('siteManager: pubSubTable.duplicatePageConfirm');

        var site = getSite();
        var newPages = site.duplicatePage(pageId);

        // duplicate page doesn't return this, but does add a page, so reset:
        setSite(site);

        PubSub.publish(pubSubTable.pageAdded, {
          pageData: newPages
        });

        PubSub.publish(pubSubTable.pagesChanged, {
          pages: site.pages,
          currentPageID: newPages[0].id
        });

        PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);

      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.pageMoved, function (msg, pageMoveData) {

        rcapLogger.info('siteManager: pubSubTable.pageMoved');

        var site = getSite();

        site.movePage(pageMoveData);

        setSite(site);
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.changeSelectedPageId, function (msg, pageId) {

        rcapLogger.info('siteManager: pubSubTable.changeSelectedPageId');

        // update the site's current page:
        var site = getSite();
        site.currentPageID = pageId;

        // fire off the specific page:
        PubSub.publish(pubSubTable.changeSelectedPage, getSite().getPageByID(pageId));

        PubSub.publish(pubSubTable.pagesChanged, {
          pages: site.pages,
          currentPageID: site.currentPageID
        });

        $('#rcap-stage')[0].scrollTop = 0;
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.changeSelectedPageByTitle, function (msg, pageTitle) {

        rcapLogger.info('siteManager: pubSubTable.changeSelectedPageByTitle');

        // update the site's current page:
        var site = getSite(),
          currentPage;

        if (pageTitle.length === 0) {

          // no page, so show them the first page:
          currentPage = site.getFirstPage();

        } else {

          // and find the page by its navigation title:
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
      PubSub.subscribe(pubSubTable.pageSettingsClicked, function (msg, pageId) {

        rcapLogger.info('siteManager: pubSubTable.pageSettingsClicked');

        var site = getSite();

        // for validation purposes, get the current list of page navigation titles:
        PubSub.publish(pubSubTable.showPageSettingsDialog, {
          page: site.getPageByID(pageId),
          currentPageNavigationTitles: site.getPageNavigationTitles(),
          canDelete: site.canDeletePage(pageId)
        });
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.changePageOrder, function (msg, pageIds) {

        rcapLogger.info('siteManager: pubSubTable.changePageOrder');

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
      PubSub.subscribe(pubSubTable.updateControl, function (msg, control) {

        rcapLogger.info('siteManager: pubSubTable.updateControl');

        var site = getSite();
        setSite(site.updateControl(control));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      //
      //
      PubSub.subscribe(pubSubTable.deleteControlConfirm, function (msg, controlID) {

        rcapLogger.log('siteManager: pubSubTable.deleteControlConfirm');

        var site = getSite();
        setSite(site.deleteControl(controlID));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      // data sources
      //
      PubSub.subscribe(pubSubTable.addDataSource, function () {

        rcapLogger.info('siteManager: pubSubTable.addDataSource');

        var site = getSite();
        var newDataSource = site.createDataSource();
        site.dataSources.push(newDataSource);

        setSite(site);

        // let interested parties know that a data source has been added:
        PubSub.publish(pubSubTable.dataSourceAdded, newDataSource);

        // publish an update count:
        PubSub.publish(pubSubTable.dataSourceCountChanged, site.dataSources.length);
      });

      PubSub.subscribe(pubSubTable.deleteDataSourceConfirm, function (msg, dataSourceId) {

        rcapLogger.info('siteManager: pubSubTable.deleteDataSourceConfirm');

        var site = getSite().deleteDataSource(dataSourceId);

        setSite(site);

        // publish an update count:
        PubSub.publish(pubSubTable.dataSourceCountChanged, site.dataSources.length);
      });

      PubSub.subscribe(pubSubTable.dataSourceSettingsClicked, function (msg, id) {

        rcapLogger.info('siteManager: pubSubTable.dataSourceSettingsClicked');

        var site = getSite();

        PubSub.publish(pubSubTable.showDataSourceSettingsDialog, site.getDataSourceByID(id));
      });

      PubSub.subscribe(pubSubTable.updateDataSource, function (msg, dataSourceObj) {

        rcapLogger.info('siteManager: pubSubTable.updateDataSource');

        setSite(getSite().updateDataSource(dataSourceObj));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      // timers
      //
      PubSub.subscribe(pubSubTable.addTimer, function () {

        rcapLogger.info('siteManager: pubSubTable.addTimer');

        var site = getSite();
        var newTimer = site.createTimer();
        site.timers.push(newTimer);

        setSite(site);

        // let interested parties know that a timer has been added:
        PubSub.publish(pubSubTable.timerAdded, newTimer);

        // publish an update count:
        PubSub.publish(pubSubTable.timerCountChanged, site.timers.length);
      });

      PubSub.subscribe(pubSubTable.deleteTimerConfirm, function (msg, timerId) {

        rcapLogger.info('siteManager: pubSubTable.deleteTimerConfirm');

        var site = getSite().deleteTimer(timerId);

        setSite(site);

        // publish an update count:
        PubSub.publish(pubSubTable.timerCountChanged, site.timers.length);
      });

      PubSub.subscribe(pubSubTable.timerSettingsClicked, function (msg, id) {

        rcapLogger.info('siteManager: pubSubTable.timerSettingsClicked');

        var site = getSite();

        PubSub.publish(pubSubTable.showTimerSettingsDialog, site.getTimerByID(id));
      });

      PubSub.subscribe(pubSubTable.updateTimer, function (msg, timerObj) {

        rcapLogger.info('siteManager: pubSubTable.updateTimer');

        setSite(getSite().updateTimer(timerObj));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      // grid options
      //
      // PubSub.subscribe(pubSubTable.gridSettingsUpdated, function(msg, gridSettings) {

      //     rcapLogger.info('siteManager: pubSubTable.gridSettingsUpdated');

      //     setSite(getSite().updateGridOptions(gridSettings));
      // });

      // site settings
      //
      PubSub.subscribe(pubSubTable.editSiteSettings, function () {
        rcapLogger.info('siteManager: pubSubTable.editSiteSettings');

        // get the site settings:
        var siteSettings = getSite().getSettings();

        PubSub.publish(pubSubTable.showSiteSettingsDialog, siteSettings);
      });

      PubSub.subscribe(pubSubTable.updateSiteSettings, function (msg, settings) {
        rcapLogger.info('siteManager: pubSubTable.updateSiteSettings');

        // update the site settings:
        setSite(getSite().updateSettings(settings));

        PubSub.publish(pubSubTable.gridSettingsUpdated, settings.getSettingValue('gridControlPadding'));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      // profile variables
      //
      PubSub.subscribe(pubSubTable.configureProfile, function () {

        // get the data for the variables
        var savedVariables = getSite().getProfileVariables();
        PubSub.publish(pubSubTable.showProfileDialog, savedVariables);
      });

      PubSub.subscribe(pubSubTable.getViewerProfile, function() {
        PubSub.publish(pubSubTable.showViewerProfileDialog, getSite().getProfileVariables());
      });

      PubSub.subscribe(pubSubTable.updateProfile, function (msg, profileVariables) {
        rcapLogger.info('siteManager: pubSubTable.updateProfile');
        setSite(getSite().updateProfileVariables(profileVariables));
      });

      ////////////////////////////////////////////////////////////////////////////////////
      //
      // profile variables
      //
      PubSub.subscribe(pubSubTable.configureExecutionOrder, function () {
        // get the data for the execution order:
        var executionOrderDetails = getSite().getExecutionOrderDetails();  
        PubSub.publish(pubSubTable.showExecutionOrderDialog, executionOrderDetails);
      });

      PubSub.subscribe(pubSubTable.updateExecutionOrder, function(msg, executionOrder) {
        rcapLogger.info('siteManager: pubSubTable.updateExecutionOrder');
        setSite(getSite().updateExecutionOrder(executionOrder));
      });
    }
  });

  return SiteManager;

});
