if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

if (!window.GeoAdmin.protocol) {
    window.GeoAdmin.protocol = document.location.protocol;
}

// the tests, and possibly other stuff, don't load Ext, so
// do not initialize the Ext QuickTips if Ext isn't there.
if (typeof Ext !== "undefined") {
    Ext.QuickTips.init();
}
