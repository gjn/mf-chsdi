/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 *  @requires OpenLayers/Control/MousePosition.js
 *  @include proj4js/lib/defs/EPSG21781.js
 */

Ext.ns('GeoAdmin');

GeoAdmin.MousePosition = OpenLayers.Class(OpenLayers.Control.MousePosition, {
    epsg4326: new OpenLayers.Projection("EPSG:4326"),
    confSuffix: null,
    autoActivate: true,
    id: 'mouseposition',
    initialize: function () {
        this.confSuffix = this.suffix;
        OpenLayers.Control.MousePosition.prototype.initialize.apply(this, arguments);
    },
    redraw: function (evt) {
        var lonLat, lonLat2, newHtml;
        if (evt === null || evt === undefined) {
            this.reset();
            return;
        } else {
            if (this.lastXy === null || Math.abs(evt.xy.x - this.lastXy.x) > this.granularity || Math.abs(evt.xy.y - this.lastXy.y) > this.granularity) {
                this.lastXy = evt.xy;
                return;
            }
            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) {
                return;
            }
            if (this.displayProjection) {
                this.suffix = this.confSuffix;
                this.numDigits = this.displayProjection.projCode === "EPSG:4326" ? 5 : 0;
                lonLat.transform(this.map.getProjectionObject(), this.displayProjection);
            }
            this.lastXy = evt.xy;
        }
        newHtml = this.formatOutput(lonLat);
        if (this.displayProjection.projCode === "EPSG:4326") {
            newHtml = OpenLayers.Util.getFormattedLonLat(lonLat.lon, 'lon', 'dms') + " (" + lonLat.lon.toFixed(5) + "), " + OpenLayers.Util.getFormattedLonLat(lonLat.lat, 'lat', 'dms') + " (" + lonLat.lat.toFixed(5) +  ")";
        }
        if (newHtml !== this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },
    destroy : function () {
        this.deactivate();
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    activate: function () {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.redraw);
            this.map.events.register('mouseout', this, this.reset);
            this.redraw();
            return true;
        } else {
            return false;
        }
    },
    deactivate: function () {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('mousemove', this, this.redraw);
            this.map.events.unregister('mouseout', this, this.reset);
            this.element.innerHTML = "";
            return true;
        } else {
            return false;
        }
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.element = this.div;
        }
        return this.div;
    },
    setMap: function () {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    }
});
