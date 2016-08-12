
# RCAP

> Interactive dashboard builder for RCloud

## Introduction

RCAP is an extension to [RCloud](https://github.com/att/rcloud#readme). It
is an interactive dashboard builder tool. Each dashboard belongs to an
RCloud notebook. The RCAP designer tool can be used to create and edit
the dashboard, and the special `rcap.html` mode to view it.

## Installation

You need to install RCAP on the RCloud server. To install the latest
released build, you can use the `devtools` package:
```r
devtools::install_url(
  "https://github.com/att/rcloud.rcap/releases/download/0.3.5/rcloud.rcap_0.3.5.tar.gz"
)
```
You can also run this from within an RCloud notebook, assuming you have
access rights to install R packages on the RCloud server.

To install the development version, use
```r
devtools::install_github("att/rcloud.rcap", local = FALSE)
```

Building the development version requires `node.js` & `npm`, `bower`,
`grunt` and `GNU make`.

After installing the R package, you can enable RCAP in RCloud in the
`Settings` menu (on the bottom left). Add `rcloud.rcap` to the
`Enable Extensions` line, and reload the notebook.

You can start the designer from the `Advanced` menu.

## License

MIT @ AT&T
