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
        showPageFlyout: 'showPageFlyout',

        // page:
        addPage : 'addPage',
        pageAdded : 'pageAdded',
        updatePage : 'updatePage',
        deletePage : 'deletePage',
        deletePageConfirm : 'deletePageConfirm',
        duplicatePageConfirm : 'duplicatePageConfirm',
        pagesChanged : 'pagesChanged',
        changeSelectedPageId : 'changeSelectedPageId',
        changeSelectedPageByTitle : 'changeSelectedPageByTitle',
        changeSelectedPage :'changeSelectedPage',
        changePageOrder : 'changePageOrder',
        pageSettingsClicked : 'pageSettingsClicked',
        showPageSettingsDialog : 'showPageSettingsDialog',

        // data source:
        addDataSource : 'addDataSource',
        dataSourceAdded : 'dataSourceAdded',
        updateDataSource : 'updateDataSource',
        deleteDataSource : 'deleteDataSource',
        deleteDataSourceConfirm : 'deleteDataSourceConfirm',
        dataSourceSettingsClicked : 'dataSourceSettingsClicked',
        showDataSourceSettingsDialog : 'showDataSourceSettingsDialog',

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