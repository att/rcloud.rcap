define(['pubsub',
  'site/pubSubTable'
], function (PubSub, pubSubTable) {

  'use strict';

  var AssetManager = function () {

    var assetIdentifier = 'rcap_designer.json',
      cssAssetIdentifier = 'rcap_designer.css',
      shell = window.shell;

    var getNotebookAsset = function (filename) {

      var filenameToLoad = filename ? filename : assetIdentifier;

      return _.find(shell.notebook.model.assets, function (ass) {
        return ass.filename() === filenameToLoad;
      });
    };

    var cacheBustUrl = function (url) {
      return url + '?cachebuster=' + Math.random().toString(16).slice(2);
    };

    this.initialise = function () {

      var me = this;

      // subscribe to theme change:
      PubSub.subscribe(pubSubTable.updateTheme, function (msg, content) {
        me.save(content, cssAssetIdentifier, 'css');
        PubSub.publish(pubSubTable.updateDomTheme, me.getThemeUrl());
      });

      PubSub.subscribe(pubSubTable.editTheme, function () {
        // get the asset, show the dialog:
        var asset = getNotebookAsset(cssAssetIdentifier);

        PubSub.publish(pubSubTable.showThemeEditorDialog, asset ? asset.content() : '');
      });
    };

    this.save = function (data, filename, format) {

      var filenameToSave = filename ? filename : assetIdentifier,
        existingAsset = getNotebookAsset(filename),
        dataToSave = !format ? JSON.stringify(data) : data;

      if (existingAsset) {
        existingAsset.content(dataToSave); // jshint ignore:line
        shell.notebook.controller.update_asset(existingAsset); // jshint ignore:line
      } else {
        shell.notebook.controller.append_asset(dataToSave, filenameToSave); // jshint ignore:line
      }

      PubSub.publish(pubSubTable.saved, {
        wasTheme: filename === cssAssetIdentifier
      });
    };

    this.load = function () {
      var existingAsset = getNotebookAsset();
      return existingAsset ? existingAsset.content() : '';
    };

    this.getThemeUrl = function (designTime, cssAssetExists) {
      if (designTime) {
        var theme = getNotebookAsset(cssAssetIdentifier);
        if (theme) {
          return cacheBustUrl('/notebook.R/' + shell.gistname() + '/' + cssAssetIdentifier);
        } else {
          return undefined;
        }
      } else if (cssAssetExists) {
        var getNotebookId = function (name) {
          return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null; // jshint ignore: line
        };

        return cacheBustUrl('/notebook.R/' + getNotebookId('notebook') + '/' + cssAssetIdentifier);
      } else {
        return undefined;
      }
    };
  };

  return AssetManager;

});
