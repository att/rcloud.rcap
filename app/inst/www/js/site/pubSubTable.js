define(['pubsub', 'rcap/js/Class'], function() {

    'use strict';

    var events = {

        broadcastSiteRequest : 'broadcastSiteRequest',
        broadcastSiteResponse : 'broadcastSiteResponse',
        initSite : 'initSite',
        designerInit : 'designerInit',
        serialize : 'serialize',
        save : 'save',
        load : 'load',
        close : 'close',
        closeViewer : 'closeViewer',
        deserialize: 'deserialize',

        showMessage: 'showMessage',

        showConfirmDialog : 'showConfirmDialog',

        // page:
        addPage : 'addPage',
        updatePage : 'updatePage',

        deletePage : 'deletePage',
        deletePageConfirm : 'deletePageConfirm',

        pagesChanged : 'pagesChanged',

        // just the ID:
        changeSelectedPageId : 'changeSelectedPageId',

        // change by navigation title:
        changeSelectedPageByTitle : 'changeSelectedPageByTitle',

        // the whole page:
        changeSelectedPage :'changeSelectedPage',
        changePageOrder : 'changePageOrder',
        pageSettingsClicked : 'pageSettingsClicked',
        showPageSettingsDialog : 'showPageSettingsDialog',

        // grid:
        gridInitComplete : 'gridInitComplete',
        gridItemAdded : 'gridItemAdded',
        gridItemsChanged : 'gridItemsChanged',

        // control/form:
        addControl : 'addControl',
        updateControl : 'updateControl',
        updateControlMarkup : 'updateControlMarkup',
        deleteControl : 'deleteControl',
        deleteControlConfirm : 'deleteControlConfirm',
        configureControl : 'configureControl',
        configureForm : 'configureForm',

        showControlDialog : 'showControlDialog',
        showFormBuilderDialog : 'showFormBuilderDialog'

    };

    return events;

});