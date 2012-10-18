#!/bin/sh

#All external svn repositories will be checked out with this script. Can be extended to also update these repositories
#runt it from root directory (like hooks/svnrepos.sh)

BASE_DIR=$(pwd)

PUBLIC_LIB_DIR="$BASE_DIR"/chsdi/public/lib
GEOEXT_UX_DEV_DIR="$BASE_DIR"/chsdi/public/lib/geoext.ux.dev
PROJ4JS_DIR="$BASE_DIR"/chsdi/public/lib/proj4js
EXT_DIR="$BASE_DIR"/chsdi/public/lib/ext
PUBLIC_BUILD_DIR="$BASE_DIR"/chsdi/public/build

if [ ! -d "$PUBLIC_LIB_DIR" ]; then
    mkdir -p "$PUBLIC_LIB_DIR"
fi
#check for existense of directories. If not, create them
if [ ! -d "$GEOEXT_UX_DEV_DIR" ]; then
    mkdir -p "$GEOEXT_UX_DEV_DIR"
fi
cd "$GEOEXT_UX_DEV_DIR"
svn co http://svn.geoext.org/sandbox/redlining/ Redlining
svn co http://svn.geoext.org/sandbox/cmoullet/ux/LayerManager/ LayerManager
svn co http://svn.geoext.org/sandbox/styler/ux/Styler/ Styler

if [ ! -d "$PROJ4JS_DIR" ]; then
    mkdir -p "$PROJ4JS_DIR"
fi
cd "$PROJ4JS_DIR"
svn co http://svn.osgeo.org/metacrs/proj4js/trunk/ proj4js

cd "$PUBLIC_LIB_DIR"
svn co http://svn.geoext.org/extensions/geoext.ux/ geoext.ux


if [ ! -d "$EXT_DIR" ]; then
    mkdir -p "$EXT_DIR"
fi
cd "$EXT_DIR"
svn co http://svn.geoext.org/ext/3.4.0/ Ext

if [ ! -d "$PUBLIC_BUILD_DIR" ]; then
    mkdir -p "$PUBLIC_BUILD_DIR"
fi

cd "$BASE_DIR"

