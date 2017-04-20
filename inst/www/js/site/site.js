define(['pages/page', 'data/dataSource', 'data/timer', 'site/siteSettings', 'rcap/js/utils/pageWalker'], function(Page, DataSource, Timer, SiteSettings, PageWalker) {

    'use strict';

    var generateCopiedPageName = function(pages, pageName) {
        var existingPages = _.map(pages, function(p) {
                return p.navigationTitle.toUpperCase();
            }),
            test,
            index = 0,
            generatePageNameTest = function(page, index) {
                return index === 0 ? page : (page + ' (' + index.toString() + ')');
            };

        for (;; index++) {
            // naming convention is for
            // 'Home Page' -> 'Home Page(n)', where n is positive integer and unique to existing page collection:

            // case insensitive:
            test = generatePageNameTest(pageName, index).toUpperCase();

            if (existingPages.indexOf(test) === -1) {
                break;
            }
        }

        // preserve case:
        return generatePageNameTest(pageName, index);
    };

    var Site = Class.extend({

        init: function(options) {
            options = options || {};

            this.saveTicks = options.saveTicks;
            this.isDesignTime = options.isDesignTime;
            this.rcapVersion = 1.0;

            // initialise with a single page:
            this.pages = options.pages || [
                new Page({
                    navigationTitle: 'Home'
                }),
            ];

            // initialise with an empty list of data sources:
            this.dataSources = options.dataSources || [];

            // timers:
            this.timers = options.timers || [];

            // settings:
            this.settings = options.settings || new SiteSettings();

            this.currentPageID = this.pages.length > 0 ? this.pages[0].id : undefined;
        },

        save: function() {
            this.saveTicks = new Date().getTime();
        },

        toJSON: function() {

            return {
                'rcapVersion': this.rcapVersion,
                'saveTicks': this.saveTicks,
                'settings': this.settings,
                'theme': this.theme,
                'pages': this.pages,
                'dataSources': this.dataSources,
                'timers': this.timers
            };

        },

        createPage: function(options) {

            options = options || {};
            var newPage = new Page(options);

            newPage.navigationTitle = generateCopiedPageName(this.pages, newPage.navigationTitle);

            if (options.parentPageId) {

                var parentPage = _.findWhere(this.pages, {
                    id: options.parentPageId
                });

                if (parentPage) {
                    newPage.depth = parentPage.depth + 1;
                    newPage.parentId = parentPage.id;
                }

            }

            return newPage;
        },
        updatePage: function(pageObj) {
            var page = this.getPageByID(pageObj.id);
            page.navigationTitle = pageObj.navigationTitle;

            // style information:
            _.each(pageObj.styleProperties, function(index, prop) {
                _.findWhere(pageObj.styleProperties, { uid : prop.uid }).value = prop.value;
            });

            // update the enabled status of this and all its (if any) child pages:
            var pages = new PageWalker(this.pages).getDescendantsAndSelf(pageObj.id);

            _.each(pages, function(p) {
                p.isEnabled = pageObj.isEnabled;
            });

            return this;
        },

        updatePageOrder: function(pageIds) {

            this.pages = _.sortBy(this.pages, function(page) {
                return pageIds.indexOf(page.id);
            });

            return this;
        },

        canDeletePage: function(pageId) {
            var page = _.findWhere(this.pages, { id : pageId });

            // if it's a child page, then let it go:
            if(page.depth > 1) {
                return true;
            } else {
                // if this is a root page, ensure that there is another root level page:
                return _.filter(this.pages, function(p) { return p.depth === 1; }).length > 1;
            }
        },

        deletePage: function(pageId) {

            this.pages = new PageWalker(this.pages).removePage(pageId);

            this.currentPageID = this.pages.length > 0 ? this.pages[0].id : undefined;

            return this;
        },

        duplicatePage: function(rootPageId) {

            // get the page(s) that need to be duplicated;
            // if the page has child pages, they will also need to be duplicated:
            var me = this,
                pagesToCopy = new PageWalker(this.pages).getDescendantsAndSelf(rootPageId),
                newPage,
                mappings = [],
                newPages = [];

            // generate, rename and push:
            _.each(pagesToCopy, function(pageToCopy) {
                // if this is the root page, retain its parent ID,
                // otherwise reassign:
                newPage = pageToCopy.duplicate();

                // update the mappings:
                mappings.push({
                    oldId : pageToCopy.id,
                    newId : newPage.id
                });

                // update the page name:
                newPage.navigationTitle = generateCopiedPageName(me.pages, newPage.navigationTitle);

                // does this new page's parent ID need to be updated? (based on the mappings that have
                // been collated):
                if(pageToCopy.id !== rootPageId) { // root page should stay the same since it will have the same parent!
                    var foundMapping = _.findWhere(mappings, { oldId : newPage.parentId });

                    if(foundMapping) {
                        newPage.parentId = foundMapping.newId;
                    }
                }

                // add the new page to the new pages:
                newPages.push(newPage);

                // and add to the site:
                me.pages.push(newPage);

            });

            return newPages;
        },

        movePage: function(pageMoveData) {

          //                 _____                   _______                   _____                   _______
          //      /\    \                 /::\    \                 /\    \                 /::\    \
          //     /::\    \               /::::\    \               /::\    \               /::::\    \
          //     \:::\    \             /::::::\    \             /::::\    \             /::::::\    \
          //      \:::\    \           /::::::::\    \           /::::::\    \           /::::::::\    \
          //       \:::\    \         /:::/~~\:::\    \         /:::/\:::\    \         /:::/~~\:::\    \
          //        \:::\    \       /:::/    \:::\    \       /:::/  \:::\    \       /:::/    \:::\    \
          //        /::::\    \     /:::/    / \:::\    \     /:::/    \:::\    \     /:::/    / \:::\    \
          //       /::::::\    \   /:::/____/   \:::\____\   /:::/    / \:::\    \   /:::/____/   \:::\____\
          //      /:::/\:::\    \ |:::|    |     |:::|    | /:::/    /   \:::\ ___\ |:::|    |     |:::|    |
          //     /:::/  \:::\____\|:::|____|     |:::|    |/:::/____/     \:::|    ||:::|____|     |:::|    |
          //    /:::/    \::/    / \:::\    \   /:::/    / \:::\    \     /:::|____| \:::\    \   /:::/    /
          //   /:::/    / \/____/   \:::\    \ /:::/    /   \:::\    \   /:::/    /   \:::\    \ /:::/    /
          //  /:::/    /             \:::\    /:::/    /     \:::\    \ /:::/    /     \:::\    /:::/    /
          // /:::/    /               \:::\__/:::/    /       \:::\    /:::/    /       \:::\__/:::/    /
          // \::/    /                 \::::::::/    /         \:::\  /:::/    /         \::::::::/    /
          //  \/____/                   \::::::/    /           \:::\/:::/    /           \::::::/    /
          //                             \::::/    /             \::::::/    /             \::::/    /
          //                              \::/____/               \::::/    /               \::/____/
          //                               ~~                      \::/____/                 ~~
          //                                                        ~~
          // update the depth
          //

          var movedPage = this.getPageByID(pageMoveData.movedPage),
              targetPage = this.getPageByID(pageMoveData.targetPage),
              position,
              depthAdjust = (targetPage.depth ? targetPage.depth : 1) - (movedPage.depth ? movedPage.depth : 1);

          if(pageMoveData.position === 'before') {

          } else if(pageMoveData.position === 'after') {

            this.pages = _.without(this.pages, _.findWhere(this.pages, {
              id: movedPage.id
            }));

            // same level??
            // move so it's just after the targetPage:
            position = this.pages.findIndex(function(page) { return page.id === pageMoveData.targetPage; });

            this.pages.splice(position + 1, 0, movedPage);

            // different parent?
            if(movedPage.parentId !== targetPage.parentId) {
              movedPage.parentId = targetPage.parentId;

              // update depth of affected pages:
              new PageWalker(this.pages).getDescendantsAndSelf(movedPage.id).forEach(function(page) {
                page.depth += depthAdjust;
              });
            }

          } else if(pageMoveData.position === 'inside') {
            // set the parent node of the movedPage:
            movedPage.parentId = pageMoveData.targetPage;

            this.pages = _.without(this.pages, _.findWhere(this.pages, {
              id: movedPage.id
            }));

            // move so it's just after the targetPage:
            position = this.pages.findIndex(function(page) { return page.id === pageMoveData.targetPage; });

            this.pages.splice(position + 1, 0, movedPage);

            // update the depth of the affected pages:
            new PageWalker(this.pages).getDescendantsAndSelf(movedPage.id).forEach(function(page) {
              page.depth += depthAdjust;
            });
          }
        },

        updateControl: function(control) {
            var controlToUpdate = this.getPageByID(this.currentPageID).getControlByID(control.id);
            controlToUpdate = control;
            return this;
        },

        deleteControl: function(controlID) {
            // get current page's controls:
            var currentPage = this.getPageByID(this.currentPageID);
            var currentPageControls = currentPage.controls;
            currentPageControls = _.without(currentPageControls, _.findWhere(currentPageControls, {
                id: controlID
            }));

            currentPage.controls = currentPageControls;

            return this;
        },

        getPageNavigationTitles: function() {
            return _.pluck(this.pages, 'navigationTitle');
        },

        getPageByID: function(pageId) {
            return _.findWhere(this.pages, {
                id: pageId
            });
        },

        getPageByNavigationTitle: function(navigationTitle) {
            return _.find(this.pages, function(p) {
                return p.navigationTitle === navigationTitle;
            });
        },

        getFirstPage: function() {
            return typeof this.pages[0] === 'undefined' ? undefined : this.pages[0];
        },

        addControl: function(control) {
            var page = this.getPageByID(this.currentPageID);
            page.controls.push(control);
            return this;
        },

        setCurrentPageControls: function(controls) {
            var page = this.getPageByID(this.currentPageID);
            page.controls = controls;
            return this;
        },

        getPageTitles: function() {
            return _.pluck(this.pages, 'navigationTitle');
        },

        getSuggestedPageTitle: function() {
            var suggestedPageTitle,
                loop = 0,
                existingPageTitles = this.getPageTitles();

            for (loop = 0;; loop++) {

                // generate page title and determine whether it exists
                suggestedPageTitle = loop = 0 ? 'New Page' : ('New Page' + (loop + 1));

                if (existingPageTitles.indexOf(suggestedPageTitle) !== -1) {
                    break;
                }
            }

            return suggestedPageTitle;
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // data sources
        //
        //
        createDataSource: function(options) {

            options = options || {};
            var newDataSource = new DataSource(options);
            return newDataSource;
        },

        getDataSourceByID : function(id) {
            return _.findWhere(this.dataSources, {
                id: id
            });
        },

        deleteDataSource : function(id) {
            var dataSources = _.without(this.dataSources, _.findWhere(this.dataSources, {
                id: id
            }));

            this.dataSources = dataSources;

            return this;
        },

        updateDataSource : function(dataSource) {
            var existingDataSource = _.findWhere(this.dataSources, {
                id: dataSource.id
            });

            existingDataSource.code = dataSource.code;
            existingDataSource.variable = dataSource.variable;
            return this;
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // timers
        //
        //
        createTimer: function(options) {
            options = options || {};
            var newTimer = new Timer(options);
            return newTimer;
        },

        getTimerByID : function(id) {
            return _.findWhere(this.timers, {
                id: id
            });
        },

        deleteTimer : function(id) {
            var timers = _.without(this.timers, _.findWhere(this.timers, {
                id: id
            }));

            this.timers = timers;

            return this;
        },

        updateTimer : function(timer) {
            var existingTimer = _.findWhere(this.timers, {
                id: timer.id
            });

            existingTimer.variable = timer.variable;
            existingTimer.interval = timer.interval;
            return this;
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // themes
        //
        //
        updateTheme: function(theme) {
            this.theme = theme;
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // settings
        //
        //
        getSettings: function() {
            return this.settings;
        },

        updateSettings: function(settings) {
            this.settings = settings;
        },

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // dirty
        //
        //
        setModified: function() {
            this.modified = true;
        },

        clearModified: function() {
            this.modified = false;
        },

        isModified: function() {
            return this.modified === true;
        }

    });

    return Site;

});
