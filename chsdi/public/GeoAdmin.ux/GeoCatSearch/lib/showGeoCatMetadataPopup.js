/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/** public: method[showGeoCatMetadataPopup]
 *  :param uuid: ``String`` The metadata uuid 
 *
 *  Opens a window to show the metadata. 
 */
GeoAdmin.showGeoCatMetadataPopup = function(uuid,lang) {
    if (!lang) {
        lang = 'de';
    }
    var langs = { fr: 'fra', en: 'eng', de: 'deu' };
    var l = (langs[lang]) ? langs[lang] : 'deu';

    new Ext.Window({
        title: OpenLayers.i18n('Metadata'),
        layout: 'fit',
        maximizable: false,
        modal: true,
        width: 1055,
        height: 500,
        items: {
            xtype: 'box',
            autoEl: {
                tag: 'iframe',
                src: "http://www.geocat.ch/geonetwork/srv/" + l + "/metadata.show?uuid=" + uuid + "&printview",
                align: 'left',
                scrolling: 'auto',
                marginheight: 0,
                marginwidth: 0,
                frameborder: 0
            }
        }
    }).show();
    // prevent default browser behavior when called in an hyperlink onclick
    return false;
};
