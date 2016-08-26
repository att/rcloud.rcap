#! /usr/bin/env bash

set -e

# Defaults
full=false

usage() {
    echo "Usage: $0 [-h|--help] [-f|--full]"
}

while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        -h|--help)
	    usage
	    exit 2
	    ;;
	-f|--full)
	    full=true
	    ;;
	*)
	    echo Unknown option: $key
	    usage
	    exit 1
	    ;;
    esac
    shift
done

if [[ $full != "true" ]]; then
    echo "WARNING: Skipping 'npm install', you may need to run it manually"
    echo "WARNING: Skipping 'bower install', you may need to run it manually"
fi

# R CMD build ignores the output and the exit value of the cleanup
# script, so we run grunt manually here
# If --full is specified, then we run npm install & bower install as well,
# via the cleanup script

export full

(
    if [[ $full == "true" ]]; then
	. cleanup
    else
	cd inst
	grunt
    fi
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
