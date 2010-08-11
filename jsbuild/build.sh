#!/bin/bash

# 
# This script can be used to automate the building of the project's
# JavaScript code during the development phase.
#
# It requires the libnotify-bin Debian package, and the nosier 
# Python package (in the virtual environment).
#
# At the root of the MapFish project (where the jsbuild dir is)
# enter this command
#
# launch it with:
#   nosier -p chsdi/public -b 'build' -b '*.sw*' jsbuild/build.sh

state_file="/tmp/.javascript_build_failed"

../env/bin/jsbuild jsbuild/api.cfg -u -o chsdi/public/build/

if [[ $? -ne 0 ]]; then
    notify-send -i /usr/share/icons/gnome/32x32/actions/stop.png "JS build failed" "check your deps..."
    touch ${state_file}
    exit 1
elif [[ -f ${state_file} ]]; then
    notify-send "JS build fixed"
    rm -f ${state_file}
fi

exit 0
