define(['pubsub', 'rcap/js/Class'], function() {

    'use strict';

    var events = {

        initSite : 'initSite',
        designerInit : 'designerInit',
        serialize : 'serialize',
        save : 'save',
        load : 'load',
        close : 'close',
        deserialize: 'deserialize',

        showMessage: 'showMessage',

        showConfirmDialog : 'showConfirmDialog',

        // page:
        addPage : 'addPage',
        updatePage : 'updatePage',

        deletePage : 'deletePage',
        deletePageConfirm : 'deletePageConfirm',

        // just the ID:
        changeSelectedPageId : 'changeSelectedPageId',
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
        deleteControl : 'deleteControl',
        deleteControlConfirm : 'deleteControlConfirm',
        configureControl : 'configureControl',
        configureForm : 'configureForm',

        showControlDialog : 'showControlDialog',
        showFormBuilderDialog : 'showFormBuilderDialog'

    };

    return events;

});