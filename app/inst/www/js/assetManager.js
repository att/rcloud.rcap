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
            PubSub.subscribe(pubSubTable.updateTheme, function(msg, content) {
                me.save(content, themeAssetIdentifier, 'css');
                PubSub.publish(pubSubTable.updateDomTheme, me.getThemeUrl());
            });

            PubSub.subscribe(pubSubTable.editTheme, function() {
                // get the asset, show the dialog:
                var asset = getNotebookAsset(themeAssetIdentifier);

                PubSub.publish(pubSubTable.showThemeEditorDialog, asset ? asset.content() : '');
            });
        };

        this.save = function(data, filename, format) {

            var filenameToSave = filename ? filename : assetIdentifier,
                existingAsset = getNotebookAsset(filename),
                dataToSave = !format ? JSON.stringify(data) : data;

            if (existingAsset) {
                existingAsset.content(dataToSave); // jshint ignore:line
                shell.notebook.controller.update_asset(existingAsset); // jshint ignore:line
            } else {
                shell.notebook.controller.append_asset(dataToSave, filenameToSave); // jshint ignore:line
            }
        };

        this.load = function() {
            var existingAsset = getNotebookAsset();
            return existingAsset ? existingAsset.content() : '';
        };

        this.getThemeUrl = function(designTime, themeExists) {
            if(designTime) {
                var theme = getNotebookAsset(themeAssetIdentifier);
                if(theme) {
                    return '/notebook.R/' + shell.gistname() + '/' + themeAssetIdentifier + '?cachebuster=' + Math.random().toString(16).slice(2);
                } else {
                    return undefined;
                }    
            } else if(themeExists) {
                var getNotebookId = function(name) {
                    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null; // jshint ignore: line
                };

                return '/notebook.R/' + getNotebookId('notebook') + '/' + themeAssetIdentifier + '?cachebuster=' + Math.random().toString(16).slice(2);
            } else {
                return undefined;
            }
            
        };
    };

    return AssetManager;

});