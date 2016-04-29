define([], function() {

    'use strict';

    var AssetManager = function() {

        var assetIdentifier = 'rcap_designer.json';
        var shell = window.shell;

        var getNotebookAsset = function(filename) {

            var filenameToLoad = filename ? filename : assetIdentifier;

            return _.find(shell.notebook.model.assets, function(ass) {
                return ass.filename() === filenameToLoad;
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
            var themeAssetName = 'rcap_designer.css';
            var theme = getNotebookAsset(themeAssetName);
            if(theme) {
                return '/notebook.R/' + shell.gistname() + '/' + themeAssetName;
            } else {
                return undefined;
            }
        };

    };

    return AssetManager;

});