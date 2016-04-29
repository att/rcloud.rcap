define(['pubsub',
    'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var AssetManager = function() {

        var assetIdentifier = 'rcap_designer.json',
            themeAssetIdentifier = 'rcap_designer.css',
            shell = window.shell;

        var getNotebookAsset = function(filename) {

            var filenameToLoad = filename ? filename : assetIdentifier;

            return _.find(shell.notebook.model.assets, function(ass) {
                return ass.filename() === filenameToLoad;
            });
        };

        this.initialise = function() {

            var me = this;
            
            // subscribe to theme change:
            PubSub.subscribe(pubSubTable.updateTheme, function() {
                PubSub.publish(pubSubTable.updateDomTheme, me.getThemeUrl());
            });

            PubSub.subscribe(pubSubTable.editTheme, function() {

                // get the asset, show the dialog:
                PubSub.publish(pubSubTable.showThemeEditorDialog, getNotebookAsset(themeAssetIdentifier));

            });
        };

        this.save = function(data) {

            var existingAsset = getNotebookAsset();

            if (existingAsset) {
                existingAsset.content(JSON.stringify(data)); // jshint ignore:line
                shell.notebook.controller.update_asset(existingAsset); // jshint ignore:line
            } else {
                shell.notebook.controller.append_asset(JSON.stringify(data), assetIdentifier); // jshint ignore:line
            }
        };

        this.load = function() {
            var existingAsset = getNotebookAsset();
            return existingAsset ? existingAsset.content() : '';
        };

        this.getThemeUrl = function() {
            var theme = getNotebookAsset(themeAssetIdentifier);
            if(theme) {
                return '/notebook.R/' + shell.gistname() + '/' + themeAssetIdentifier + '?cachebuster=' + Math.random().toString(16).slice(2);
            } else {
                return undefined;
            }
        };

    };

    return AssetManager;

});