/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include KmlSelector/lib/KmlSelectorPanel.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.KmlSelectorWindow = Ext.extend(Ext.Window, {
    
    map: null,
    
    constructor: function(config) {
        this.cls = 'kml-window',	
        this.map = config.map|| null;
        var kmlSelectorPanel = new GeoAdmin.KmlSelectorPanel({
            map: this.map
        });

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 426,
            height: 134,
            title: OpenLayers.i18n("KML"),
            layout: 'fit',
            items: [kmlSelectorPanel],
            map: this.map
        }, config);

        GeoAdmin.KmlSelectorWindow.superclass.constructor.call(this, config);
    },
    show: function() {
        GeoAdmin.KmlSelectorWindow.superclass.show.apply(this, arguments);
        var mapDiv = Ext.fly(this.map.div);
        var mapViewPort = this.map.getViewport();
        if (mapDiv && mapViewPort) {
            var mapBox = mapDiv.getBox(true);
            var OffsetLeft = OffsetTop = 0;
            if (mapViewPort.offsetParent) {
                do {
                    OffsetLeft += mapViewPort.offsetLeft;
                    OffsetTop += mapViewPort.offsetTop;
                } while (mapViewPort = mapViewPort.offsetParent);
            }
            this.setPosition(OffsetLeft + mapBox.width/2 - this.width/2, OffsetTop);
        }
    }
});
