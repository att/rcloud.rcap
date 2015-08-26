define(['pubsub', 'controls/factories/controlFactory'], 
	function(PubSub, ControlFactory) {

    'use strict';

    return {

        initialise: function() {

            PubSub.subscribe('rcap:serialize', function(msg, gridItems) {
                // todo: persist to notebook:
                localStorage.setItem('rcap', JSON.stringify(gridItems));

                // Look for the config file in the assets
                var assetConfigName = 'rcap_designer.json';
      			var assetNames = shell.notebook.model.assets.map(function(x) {return x.filename();});
                
                var configIndex = assetNames.indexOf(assetConfigName);
                if (configIndex > -1) {
                	// Overwrite it.
                	var targetAsset = shell.notebook.model.assets[configIndex];
                	targetAsset.content(JSON.stringif(gridItems));
                	shell.notebook.controller.update_asset(targetAsset);


                } else {
                	// We're going to have to create it.
                	shell.notebook.controller.append_asset(JSON.stringify(gridItems), assetConfigName);
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
					rawData = msgData.hasOwnProperty('jsonData') ? msgData.jsonData : localStorage.getItem('rcap');

				data = rawData.length > 0 ? JSON.parse(rawData) : [];

				// loop through each control:
				for( ; controlLoop < data.length; ++controlLoop) {

					// create the appropriate control type:
					jsonControl = data[controlLoop];

					control = controlFactory.getByKey(jsonControl.type);

					// set control properties:
					for (property in jsonControl) {
						// don't overwrite the control properties, they will be updated separately below:
					    if (jsonControl.hasOwnProperty(property) && property !== 'controlProperties') {
					        control[property] = jsonControl[property];
					    }
					}

					// loop through each property:
					for( propertyLoop = 0; propertyLoop < jsonControl.controlProperties.length; ++propertyLoop) {
						jsonControlProperty = jsonControl.controlProperties[propertyLoop];

						// uid, value, id:

						// get the property:
						currProp = _.findWhere(control.controlProperties, { uid : jsonControlProperty.uid });

						if( currProp !== undefined) {
							currProp.value = jsonControlProperty.value;
							currProp.id = jsonControlProperty.id;
						}
					}

					controls.push(control);
				}

                // publish:
                PubSub.publish('grid:' + msgData.type + '-init', controls);
            });
        }
    };
});