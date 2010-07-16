#!/bin/bash
#
# Copyright (C) 2008  Camptocamp
#
# This file is part of MapFish
#
# MapFish is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# MapFish is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with MapFish.  If not, see <http://www.gnu.org/licenses/>.

# MapFish sample deployment file
#
# See the instructions at http://trac.mapfish.org/trac/mapfish/wiki/deployment for
# more informations

# === The next section shouldn't be edited, but kept in sync with deploy-sample.sh ===
# See: https://project.camptocamp.com/svn/c2c_mapfish/trunk/deploy/deploy-sample.sh

set -e

DEPLOY_SVN=https://project.camptocamp.com/svn/c2c_mapfish/trunk/deploy
COMPAT_VERSION=1

checkout_deploy() {
    OUTPUT=$(svn co $SVN_CO_OPTIONS $DEPLOY_SVN)
    if echo "$OUTPUT" | grep -q "deploy/"; then
        REV=$(svn info deploy|grep Revision:|sed "s/Revision: //")
        echo "Deploy script was retrieved or updated (rev: $REV)"
        exec $0 $*
    fi
}

if [ -z "$SKIP_UPDATE_CHECK" ]; then
    checkout_deploy $*
fi

if [ ! -f deploy/deploy.sh ]; then
    echo "Error while fetching the deploy script"
    exit 1
fi
. deploy/deploy.sh

# === c2c specific check (do not need to keep in sync with deploy-sample.sh) ===

if echo $BASE | grep -q '/deploy$'; then
    echo "You shouldn't launch this script from here."
    echo "Refer to the documentation here: https://project.camptocamp.com/doc/c2c_mapfish/MapFish/ProjectsDeployment"
    exit 1
fi

# === Configuration starts here ===

# Set this to "1" to install a Python environment for MapFish in this directory
FETCH_PYTHON_ENV=1

# Project name
PROJECT=chsdi

# Project subversion URL
PROJECT_SVN_BASE=https://svn.bgdi.admin.ch/mf-chsdi/trunk/chsdi/

# Project MapFish directory
#PROJECT_MAPFISH_DIR=$PROJECT/MapFish

# Set this to "1" if project contains a copy of MapFish (usually using svn:externals)
HAS_MAPFISH=0

# You can define function that will be run at certain stages in the installation process
# This is an example function that will be run after initialization
#post_init_all() {
#    echo "Sample post_init hook"
#}

# === End of configuration ===
# Keep the following part at the end of this file
main $*
