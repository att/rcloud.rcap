
# RCAP

> Interactive dashboard builder for RCloud

## Introduction

RCAP is an extension to [RCloud](https://github.com/att/rcloud#readme). It
is an interactive dashboard builder tool. Each dashboard belongs to an
RCloud notebook. The RCAP designer tool can be used to create and edit
the dashboard, and the special `rcap.html` mode to view it.


## Building

Build has the following environment dependencies:

 * `node.js` & `npm`, `bower`,
 * `grunt` and `GNU make`.
 
To build RCAP package run the following command from package source:


    git clone https://github.com/att/rcloud.rcap
    sh ./mkdist

The 'mkdist' script accepts a number of optional parameters useful during development: 

```sh
 Usage: ./mkdist [{--no-npm | --no-js | --no-clean > | --help}] [install]
 --no-clean - skips clean phase
 --no-npm - skips npm processing step (implies --no-clean option)
 --no-js - skips entire JavaScript processing step (implies --no-npm option)
 --help - displays usage information

 --install - should package be installed after it has been built.
```


## Installation

### RCAP bundle

It is possible to install RCAP from R package bundle, which contains all JS dependencies.

```sh
wget 'https://github.com/att/rcloud.rcap/releases/download/0.4/rcloud.rcap_0.4.6.2.tar.gz'
R CMD INSTALL rcloud.rcap_0.4.6.2.tar.gz
```


### devtools

To install the latest released build, you can use the `devtools` package:
```r
devtools::install_url(
  "https://github.com/att/rcloud.rcap/releases/download/0.4/rcloud.rcap_0.4.6.2.tar.gz"
)
```
You can also run this from within an RCloud notebook, assuming you have
access rights to install R packages on the RCloud server.

To install the development version, use
```r
devtools::install_github("att/rcloud.rcap@develop", local = FALSE)
```

## Configuration

After installing the R package, you can enable RCAP in RCloud in the
`Settings` menu (on the bottom left). Add `rcloud.rcap` to the
`Enable Extensions` line, and reload the notebook.

You can start the designer from the `Advanced` menu.

## License

MIT @ AT&T
