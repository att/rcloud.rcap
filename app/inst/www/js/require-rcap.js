requirejs.config(requirejs_config_obj); // jshint ignore:line

var deps = common_deps; // jshint ignore:line

deps.push(
    // rcloud's mini.js and bundle
    '../../shared.R/rcloud.rcap/js/rcap', 'rcloud_bundle');
console.log('MINI');
start_require(deps); // jshint ignore:line
