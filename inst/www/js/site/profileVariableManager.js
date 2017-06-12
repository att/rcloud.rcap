define(['css!select2/css/select2.min.css'], function () {

  'use strict';

  var ProfileVariableManager = function() {

    var getOptions = function(allValues, userValues) {
      // if there are no common values between allValues and userValues,
      // this is either a new setup for this variable, or the data is 'old'
      // and has changed so much that it's effectively a new setup:
      var commonValuesLength = _.intersection(_.pluck(allValues, 'value'), _.pluck(userValues, 'value')).length;

      return _.map(allValues, function(item) { return {
          value: item.value,
          selected: !commonValuesLength ? true : _.pluck(userValues, 'value').indexOf(item.value) !== -1
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
        Promise.all(promises).then(function (res) {
          for (var loop = 0; loop < res.length / 2; loop++) {
            profileDataItems.push({
              // name, all, user
              name: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'variablename' }).value,
              description: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'description' }).value,
              id: profileVariables[loop].id,
              options: getOptions(res[loop * 2], res[(loop * 2) + 1]),
              all: !res[(loop * 2) + 1],
              valueHash: that.hashValues(!res[(loop * 2) + 1] ? undefined : _.pluck(res[(loop * 2) + 1], 'value'))
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
