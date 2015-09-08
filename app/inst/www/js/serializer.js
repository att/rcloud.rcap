define(['pubsub', 'controls/factories/controlFactory'],
    function(PubSub, ControlFactory) {

        'use strict';

        return {

            initialise: function() {

                PubSub.subscribe('rcap:serialize', function(msg, gridItems) {

                    // todo: persist to notebook:
                    localStorage.setItem('rcap', JSON.stringify(gridItems));

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
                        targetAsset.content(JSON.stringify(gridItems)); // jshint ignore:line
                        shell.notebook.controller.update_asset(targetAsset); // jshint ignore:line
                    } else {
                        // We're going to have to create it.
                        shell.notebook.controller.append_asset(JSON.stringify(gridItems), assetConfigName); // jshint ignore:line
                    }
                });

                PubSub.subscribe('rcap:deserialize', function(msg, msgData) {

                    var controls = [],
                        control,
                        jsonControl,
                        jsonControlProperty,
                        controlLoop = 0,
                        propertyLoop,
                        property,
                        currProp,
                        data,
                        controlFactory = new ControlFactory(),
                        currentChild,
                        rawData = msgData.hasOwnProperty('jsonData') ? msgData.jsonData : localStorage.getItem('rcap');

                    data = rawData.length > 0 ? JSON.parse(rawData) : [];

                    // loop through each control:
                    for (; controlLoop < data.length; ++controlLoop) {

                        // create the appropriate control type:
                        jsonControl = data[controlLoop];

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
                                    }
                                }

                                control.childControls.push(currentChild);
                            }
                        }

                        // add the control:
                        controls.push(control);
                    }

                    // publish:
                    PubSub.publish('grid:' + msgData.type + '-init', controls);
                });
            }
        };
    });
