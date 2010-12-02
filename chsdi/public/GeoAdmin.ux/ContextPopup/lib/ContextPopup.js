/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 *
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Projection.js
 *
 * @include GeoExt/widgets/Popup.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = ContextPopup
 *  base_link = `OpenLayers.Control.Navigation <http://dev.openlayers.org/apidocs/files/OpenLayers/Control/Navigation-js.html>`_
 */

GeoAdmin.ContextPopup = OpenLayers.Class(OpenLayers.Control.Navigation, {

    initialize: function(options) {
        OpenLayers.Control.Navigation.prototype.initialize.apply(this, arguments);
        this.map.addControl(this);
        this.activate();
        this.handlers.click.callbacks.rightclick = function() {
            var lonlatCH = this.map.getLonLatFromViewPortPx(this.handlers.click.evt.xy);
            var lonlat = lonlatCH.clone();

            var paramsObject = OpenLayers.Util.getParameters(Ext.state.Manager.getProvider().getLink());
            paramsObject.Y = lonlat.lon;
            paramsObject.X = lonlat.lat;
            if (!paramsObject.zoom) {
               paramsObject.zoom = 0; 
            }
            var params = OpenLayers.Util.getParameterString(paramsObject);

            // Set popup content
            var content = "<table style='font-size: 12px;'><tr><td width=\"150\">" + OpenLayers.i18n('Swiss Coordinate') + "</td><td><a href='?" + params + "' target='new'>" + Math.round(lonlat.lon) + " " + Math.round(lonlat.lat) + '</a></td></tr>';
            lonlat.transform(this.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
            content = content + "<tr><td>" + OpenLayers.i18n('WGS 84') + "</td><td>" + Math.round(lonlat.lon * 100000) / 100000 + " " + Math.round(lonlat.lat * 100000) / 100000 + '</td></tr>';
            content = content + "<tr><td><div class='ch_bowl'></div></td><td><a href='?crosshair=bowl&" + params + "' target='new'>" + OpenLayers.i18n('Link with bowl crosshair') + "</a></td></tr></table>";

            var popup = new GeoExt.Popup({
                cls: 'positionPopup',
                title: OpenLayers.i18n('Position'),
                location: this.map.getLonLatFromPixel(this.handlers.click.evt.xy),
                width:300,
                map: this.map,
                html: content,
                maximizable: false,
                collapsible: false
            });
            popup.show();
        };
    }
});
