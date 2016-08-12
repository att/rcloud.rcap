#! /usr/bin/env bash

echo "WARNING: Not running 'npm install', you might need to run it manually"
echo "WARNING: Not running 'bower install', you might need to run it manually"

(
    pkgdir=$(basename `pwd`)
    pkgname=$(sed -n 's/^Package: //p' DESCRIPTION)
    pkgversion=$(sed -n 's/^Version: //p' DESCRIPTION)

    cd ..

    export RCAP_BUILD_FAST=hellyes
    R CMD build $pkgdir

    R CMD INSTALL ${pkgname}_${pkgversion}.tar.gz
)
