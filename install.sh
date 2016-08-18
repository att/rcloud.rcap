#! /usr/bin/env bash

set -e

echo "WARNING: Not running 'npm install', you might need to run it manually"
echo "WARNING: Not running 'bower install', you might need to run it manually"

# R CMD build ignores the output and the exit value of the cleanup
# script, so we run grunt manually here

(
    cd inst
    grunt
)

(
    pkgdir=$(basename `pwd`)
    pkgname=$(sed -n 's/^Package: //p' DESCRIPTION)
    pkgversion=$(sed -n 's/^Version: //p' DESCRIPTION)

    cd ..

    export RCAP_BUILD_FAST=hellyes
    R CMD build $pkgdir

    R CMD INSTALL ${pkgname}_${pkgversion}.tar.gz
)
