define(['pubsub', 'rcap/js/Class'], function() {

    'use strict';

    var events = {

        initSite : 'initSite',
        designerInit : 'designerInit',
        serialize : 'serialize',
        save : 'save',
        load : 'load',
        close : 'close',
        closeViewer : 'closeViewer',
        viewerShowFirstPage : 'viewerShowFirstPage',
        deserialize: 'deserialize',

        show404 : 'show404',

        showMessage: 'showMessage',

        showConfirmDialog : 'showConfirmDialog',

        // page:
        addPage : 'addPage',
        pageAdded : 'pageAdded',
        updatePage : 'updatePage',

        deletePage : 'deletePage',
        deletePageConfirm : 'deletePageConfirm',
        duplicatePageConfirm : 'duplicatePageConfirm',

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
        gridItemAddedInit : 'gridItemAddedInit',
        gridItemsChanged : 'gridItemsChanged',

        // control/form:
        startControlDrag: 'startControlDrag',
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