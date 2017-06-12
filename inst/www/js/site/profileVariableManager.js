define(['css!select2/css/select2.min.css'], function () {

  'use strict';

  var ProfileVariableManager = function() {

    var userValuesNotInAllValues = function(allValues, userValues) {
      return _.filter(userValues, function (value) {
        return !_.contains(allValues, value);
      });
    };

    var getOptions = function(allValues, userValues, allStale) {
      // if there are no common values between allValues and userValues,
      // this is either a new setup for this variable, or the data is 'old'
      // and has changed so much that it's effectively a new setup:
      var commonValuesLength = _.intersection(_.pluck(allValues, 'value'), _.pluck(userValues, 'value')).length;

      var getValue = function(item) {
        if(allStale) {
          return false;
        } else {
          return !commonValuesLength ? true : _.pluck(userValues, 'value').indexOf(item.value) !== -1;
        }
      };

      return _.map(allValues, function(item) { return {
          value: item.value,
          selected: getValue(item)
        };
      });
    };

    this.hashValues = function(values) {

      if(!values){
        return 0;
      }

      var str = _.sortBy(values).join('-');
      var hash = 0, i, chr;
      if (str.length === 0) {
        return hash;
      }

      for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr; /* jshint ignore:line */
        hash |= 0; /* jshint ignore:line */
      }
      return hash >>> 0; /* jshint ignore:line */
    };

    this.getProfileVariableData = function(profileVariables) {

      var that = this, profileDataItems = [];

      // for each profile variable, get the possible and user saved values:
      var promises = _.flatten(_.map(profileVariables, function (profileVariable) {
        return [
          window.RCAP.getUserProfileVariableValues(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value),
          window.RCAP.getUserProfileValue(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value)
        ];
      }));

      return new Promise(function(resolve) {
        var allValues, userValues, staleValues, allStale, options;
        Promise.all(promises).then(function (res) {
          for (var loop = 0; loop < res.length / 2; loop++) {

            allValues = res[loop * 2];
            userValues = res[(loop * 2) + 1];
            staleValues = userValuesNotInAllValues(_.pluck(allValues, 'value'), _.pluck(userValues, 'value'));
            allStale = userValues && staleValues.length === userValues.length;
            options = getOptions(allValues, userValues, allStale);

            profileDataItems.push({
              name: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'variablename' }).value,
              description: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'description' }).value,
              id: profileVariables[loop].id,
              options: options,
              all: !userValues,
              staleValues: staleValues,
              allStale: allStale,
              valueHash: allStale ? -1 : that.hashValues(!userValues ? undefined : _.pluck(userValues, 'value'))
            });
          }
          resolve(profileDataItems);
        });
      });
    };

    this.updateProfileVariables = function(data) {
      window.RCAP.updateControls(JSON.stringify(data));
    };
  };

  return ProfileVariableManager;

});
