define(['pubsub', 'rcap/js/Class'], function() {

    'use strict';

    var events = {

        initSite : 'initSite',
        serialize : 'serialize',
        save : 'save',
        saved: 'saved',
        close : 'close',
        closeViewer : 'closeViewer',
        viewerShowFirstPage : 'viewerShowFirstPage',
        deserialize: 'deserialize',
        show404 : 'show404',
        showMessage: 'showMessage',
        showConfirmDialog : 'showConfirmDialog',
        showPageFlyout: 'showPageFlyout',
        flyoutActivated: 'flyoutActivated',
        flyoutClosed: 'flyoutClosed',
        setModified: 'setModified',
        clearModified: 'clearModified',
        closeDesigner: 'closeDesigner',
        closeDesignerConfirm: 'closeDesignerConfirm',

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
        gridPageChangeComplete: 'gridPageChangeComplete',
        pageSettingsClicked : 'pageSettingsClicked',
        showPageSettingsDialog : 'showPageSettingsDialog',
        pageCountChanged : 'pageCountChanged',

        // data source:
        addDataSource : 'addDataSource',
        dataSourceAdded : 'dataSourceAdded',
        updateDataSource : 'updateDataSource',
        deleteDataSource : 'deleteDataSource',
        deleteDataSourceConfirm : 'deleteDataSourceConfirm',
        dataSourceSettingsClicked : 'dataSourceSettingsClicked',
        showDataSourceSettingsDialog : 'showDataSourceSettingsDialog',
        dataSourceCountChanged : 'dataSourceCountChanged',

        // timer:
        addTimer: 'addTimer',
        timerAdded: 'timerAdded',
        deleteTimer: 'deleteTimer',
        deleteTimerConfirm: 'deleteTimerConfirm',
        timerSettingsClicked: 'timerSettingsClicked',
        showTimerSettingsDialog: 'showTimerSettingsDialog',
        timerCountChanged: 'timerCountChanged',
        updateTimer: 'updateTimer',

        // grid:
        gridInitComplete : 'gridInitComplete',
        gridItemAdded : 'gridItemAdded',
        gridItemAddedInit : 'gridItemAddedInit',
        gridItemsChanged : 'gridItemsChanged',
        gridSettingsUpdated: 'gridSettingsUpdated',

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
        showFormBuilderDialog : 'showFormBuilderDialog',

        // site settings:
        editSiteSettings: 'editSiteSettings',
        showSiteSettingsDialog: 'showSiteSettingsDialog',
        updateSiteSettings: 'updateSiteSettings',
        updatePageClassSetting: 'updatePageClassSetting',

        // theme:
        updateTheme: 'updateTheme',
        updateDomTheme: 'updateDomTheme',
        intialiseDom: 'initialiseDom',
        editTheme: 'editTheme',
        showThemeEditorDialog: 'showThemeEditorDialog',
        updateSiteThemePackage: 'updateSiteThemePackage',

        // state management:
        stateModified: 'stateModified'

    };

    return events;

});