define([/*'pubsub',
  'site/pubSubTable',
  'rcap/js/utils/rcapLogger'*/], function (/*PubSub, pubSubTable, RcapLogger*/) {

  'use strict';

  var ProfileVariableManager = function() {

    // read
    // write
    // auto-update
    this.getProfileVariableData = function(profileVariables) {

      var profileDataItems = [];

      // for each profile variable, get the possible and user saved values:
      var promises = _.flatten(_.map(profileVariables, function (profileVariable) {
        return [
          window.RCAP.getUserProfileVariableValues(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value),
          window.RCAP.getUserProfileValue(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value)
        ];
      }));

      var getOptions = function(allValues, userValues) {
        // if there are no common values between allValues and userValues,
        // this is either a new setup for this variable, or the data is 'old'
        // and has changed so much that it's effectively a new setup:
        var commonValuesLength = _.intersection(allValues, userValues).length;

        return _.map(allValues, function(item) { return {
            value: item.value,
            // if user has no values, select to 'all':
            // TODO : CORRECT THIS!, NEED TO FIND 'CROSSOVER, COMMON VALUES LENGTH':
            selected: !commonValuesLength ? true : _.pluck(userValues, 'value').indexOf(item.value) !== -1
          };
        });
      };

      return new Promise(function(resolve) {
        Promise.all(promises).then(function (res) {
          for (var loop = 0; loop < res.length / 2; loop++) {
            profileDataItems.push({
              // name, all, user
              name: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'variablename' }).value,
              id: profileVariables[loop].id,
              options: getOptions(res[loop * 2], res[(loop * 2) + 1])
            });
          }
          resolve(profileDataItems);
        });
      });
    };
  };

  this.updateProfileVariables = function(data) {
    window.RCAP.updateControls(JSON.stringify(data));
    console.log(data);
  };

  return ProfileVariableManager;

});
