/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include Measure/lib/MeasurePanel.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.MeasureWindow = Ext.extend(Ext.Window, {
    map: null,

    constructor: function(config) {
        this.map = config.map || null;
        var measurePanel = new GeoAdmin.MeasurePanel({
            //title: OpenLayers.i18n("Measure Panel"),
            map: this.map

        });

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 300,
            height: 113,
            title: OpenLayers.i18n("Measure.title"),
            layout: 'fit',
            items: [measurePanel],
            map: this.map
        }, config);

        GeoAdmin.MeasureWindow.superclass.constructor.call(this, config);
    },

    onHide: function () {
        var controls = this.map.getControlsBy("displayClass", "olControlMeasure");
        for (i in controls) {
            var control = controls[i];
            if (control.active) {
                control.deactivate();
            }
        }
    },

    show: function() {
        GeoAdmin.MeasureWindow.superclass.show.apply(this,arguments);
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
