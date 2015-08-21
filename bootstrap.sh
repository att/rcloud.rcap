#!/bin/bash

# Installing R
  # This installs the latest version. Getting Ubuntu to install older versions is hard
  echo 'deb http://cran.rstudio.com/bin/linux/ubuntu trusty/' >> /etc/apt/sources.list
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9

  apt-get update
  apt-get -y install r-base-dev

# RCloud dependencies
  ## Ubuntu 14.04
  apt-get install -y -qq gcc g++ gfortran libcairo-dev libreadline-dev libxt-dev libjpeg-dev libicu-dev libssl-dev libcurl4-openssl-dev subversion git automake make libtool libtiff-dev gettext redis-server rsync

  # Install pandoc 
  wget -q https://github.com/jgm/pandoc/releases/download/1.13.2/pandoc-1.13.2-1-amd64.deb
  apt-get -y -q install gdebi-core
  gdebi -n pandoc-1.13.2-1-amd64.deb
  rm pandoc-1.13.2-1-amd64.deb

# Setup the directory and give it to the vagrant user
mkdir /data
chown vagrant /data

# Could switch over to bootstrapUser.sh where things won't be run as super user


# Installing R packages
  echo "options(repos=structure(c(CRAN=\"http://cran.rstudio.com/\")))" >> /etc/R/Rprofile.site

# Unzip, clone, or whatever, your rcloud source. From the rcloud directory:
  cd /data
  git clone https://github.com/att/rcloud.git
  # Give this to the user
  chown vagrant rcloud
  cd rcloud
  chown -R vagrant *

# Copy the config file from your host  
 cp /vagrant/rcloud.conf /data/rcloud/conf/
  
# Run the RCloud provisioning script
  cd /data/rcloud
  # Run this as root
  sh scripts/bootstrapR.sh

  # Bring RCloud up
  scripts/fresh_start.sh
