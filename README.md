# rcloud.rcap.dev
Development repository for [rcloud.rcap](https://github.research.att.com/dashton/rcloud.rcap) project. 

This repository contains the full development code for the `rcloud.rcap` pacakge. The top level contains JavaScript (node/grunt/bower) configuration files and the R package is in the `app` directory.  However, before the package can be use it must be deployed by the Grunt script. To build the R package you need several JavaScript components. Starting with node (npm), Grunt and Bower. If you don't have them already you will need the following node modules:

```
node install -g grunt-cli
node install -g bower
```

After checking out the code, from the repository root you run

```
bower install
npm install
```

This installs the required Bower components. Then you will need to edit the Grunt.js file to change the dev directory and disable the shell commands. Then do

```
grunt
```

This will copy the files into `/data/rcloud/rcloud.packages/rcloud.rcap` and attempt to build the package with `build_packages.sh`. To change the  build behaviour edit the Grunfile.js file in the `shell: dev:` section. To change installation location edit the `devDeployDir:` parameter Soon the current dev package will be deployed at the [rcloud.rcap](https://github.research.att.com/dashton/rcloud.rcap) page but currently this is out of date. At this time the instructions here should be used for installation.

