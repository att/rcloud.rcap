define(['pubsub', 'site/site', 'site/pubSubTable', 'rcap/js/ui/message', 'controls/factories/controlFactory'], 
    function(PubSub, Site, pubSubTable, Message, ControlFactory) {

    'use strict';

    var Serializer = function() {

        this.initialise = function() {

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // serialize
            //
            PubSub.subscribe(pubSubTable.serialize, function(msg, data) {

                console.info('serializer: pubSubTable.serialize');

                localStorage.setItem('rcap', JSON.stringify(data));

                var shell = window.shell;

                // Look for the config file in the assets
                var assetConfigName = 'rcap_designer.json';
                var assetNames = shell.notebook.model.assets.map(function(x) {
                    return x.filename();
                });

                var configIndex = assetNames.indexOf(assetConfigName);
                if (configIndex !== -1) {
                    // Overwrite it.
                    var targetAsset = shell.notebook.model.assets[configIndex];
                    targetAsset.content(JSON.stringify(data)); // jshint ignore:line
                    shell.notebook.controller.update_asset(targetAsset); // jshint ignore:line
                } else {
                    // We're going to have to create it.
                    shell.notebook.controller.append_asset(JSON.stringify(data), assetConfigName); // jshint ignore:line
                }

                PubSub.publish(pubSubTable.showMessage, new Message({
                    messageType : 'Information',
                    content : 'Saved'
                }));
            });

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // deserialize
            //
            PubSub.subscribe(pubSubTable.deserialize, function(msg, msgData) {

                console.info('serializer: pubSubTable.deserialize');

                var controls,
                    control,
                    jsonControl,
                    jsonControlProperty,
                    pageLoop = 0,
                    currentPage,
                    jsonPage,
                    jsonPageProperty,
                    controlLoop,
                    propertyLoop,
                    property,
                    currProp,
                    data,
                    controlFactory = new ControlFactory(),
                    currentChild,
                    rawData = msgData.hasOwnProperty('jsonData') ? msgData.jsonData : localStorage.getItem('rcap'),
                    isDesignTime = msgData.hasOwnProperty('isDesignTime') ? msgData.isDesignTime : true;

                // create a site:
                var site = new Site({
                    isDesignTime : isDesignTime
                });

                data = rawData && rawData.length > 0 ? JSON.parse(rawData) : [];

                // loop through each page:
                if (data.pages !== undefined) {

                    // we have at least a single page, so get rid of the pages we started with and 
                    // replace with what's coming in:
                    site.pages = [];

                    // and also set the current page:
                    site.currentPageID = data.pages[0].id;

                    for (; pageLoop < data.pages.length; ++pageLoop) {
                        currentPage = site.createPage();

                        jsonPage = data.pages[pageLoop];
                        controls = [];

                        // assign all properties, but ignore the controls:
                        for (jsonPageProperty in jsonPage) {
                            if (jsonPage.hasOwnProperty(jsonPageProperty) && jsonPageProperty !== 'controls') {
                                currentPage[jsonPageProperty] = jsonPage[jsonPageProperty];
                            }
                        }

                        // now loop through the controls:
                        for (controlLoop = 0; controlLoop < jsonPage.controls.length; ++controlLoop) {

                            // create the appropriate control type:
                            jsonControl = jsonPage.controls[controlLoop];

                            control = controlFactory.getByKey(jsonControl.type);

                            // set control's properties, excluding 'controlProperties' property:
                            for (property in jsonControl) {
                                // don't overwrite the control properties, they will be updated separately below:
                                if (jsonControl.hasOwnProperty(property) && property !== 'controlProperties' && property !== 'childControls') {
                                    control[property] = jsonControl[property];
                                }
                            }

                            // loop through each specific controlProperties property:
                            for (propertyLoop = 0; propertyLoop < jsonControl.controlProperties.length; ++propertyLoop) {
                                jsonControlProperty = jsonControl.controlProperties[propertyLoop];

                                // uid, value, id:

                                // get the property:
                                currProp = _.findWhere(control.controlProperties, {
                                    uid: jsonControlProperty.uid
                                });

                                if (currProp !== undefined) {
                                    currProp.value = jsonControlProperty.value;
                                    currProp.id = jsonControlProperty.id;
                                }
                            }

                            // loop through each child control:
                            if (jsonControl.hasOwnProperty('childControls')) {

                                for (propertyLoop = 0; propertyLoop < jsonControl.childControls.length; ++propertyLoop) {
                                    jsonControlProperty = jsonControl.childControls[propertyLoop];

                                    // what type is it?
                                    currentChild = controlFactory.getChildByKey(jsonControl.childControls[propertyLoop].type);
                                    currentChild.id = jsonControl.childControls[propertyLoop].id;

                                    // now loop through the child control's control properties:
                                    for (var childControlLoop = 0; childControlLoop < jsonControl.childControls[propertyLoop].controlProperties.length;
                                        ++childControlLoop) {

                                        // get the property:
                                        currProp = _.findWhere(currentChild.controlProperties, {
                                            uid: jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].uid
                                        });

                                        if (currProp !== undefined) {
                                            currProp.value = jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].value;
                                            currProp.id = jsonControl.childControls[propertyLoop].controlProperties[childControlLoop].id;

                                            // call finalise method:
                                            currProp.finalise();
                                        }
                                    }

                                    control.childControls.push(currentChild);
                                }
                            }

                            // add the control:
                            controls.push(control);
                        }

                        currentPage.controls = controls;
                        site.addPage(currentPage);

                    }
                }

                PubSub.publish(pubSubTable.initSite, site);
            });
        };

    };

    return Serializer;

});