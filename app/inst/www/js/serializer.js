define(['pubsub', 'controls/factories/controlFactory'/*, 'controls/factories/controlPropertyFactory'*/], 
	function(PubSub, ControlFactory) {

    // serializer code in yur:
    'use strict';

    return {

        initialise: function() {

            PubSub.subscribe('rcap:serialize', function(msg, gridItems) {
                // todo: persist to notebook:
                localStorage.setItem('rcap', JSON.stringify(gridItems));
            });

			PubSub.subscribe('rcap:deserialize', function() {

				var controls = [],
					control,
					jsonControl,
					jsonControlProperty,
					controlLoop = 0,
					propertyLoop,
					data,
					controlFactory = new ControlFactory(),
					rawData = localStorage.getItem('rcap');

				data = rawData.length > 0 ? JSON.parse(rawData) : [];

				// loop through each control:
				for( ; controlLoop < data.length; ++controlLoop) {

					// create the appropriate control type:
					jsonControl = data[controlLoop];

					control = controlFactory.getByKey(jsonControl.type);

					// set control properties:
					for (var property in jsonControl) {
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
						var currProp = _.findWhere(control.controlProperties, { uid : jsonControlProperty.uid });

						if( currProp !== undefined) {
							currProp.value = jsonControlProperty.value;
							currProp.id = jsonControlProperty.id;
						}
					}

					controls.push(control);
				}

                // publish:
                PubSub.publish('rcap:open', controls);
            });
        }
    };
});