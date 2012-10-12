/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 *
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Projection.js
 *
 * @include GeoExt/widgets/Popup.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = ContextPopup
 *  base_link = `OpenLayers.Control <http://dev.openlayers.org/apidocs/files/OpenLayers/Control-js.html>`_
 */

/** api: example
 *  Sample code to create a context popup (click with right mouse button) (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples3.html#context-popup>`_)
 *
 *  .. code-block:: javascript
 *
 *     var map13 = new GeoAdmin.Map("mymap3", {doZoomToMaxExtent: true});
 *     var contextPopup = new GeoAdmin.ContextPopup({map: map13});
 *
 *
 */

/** api: constructor
 *  .. class:: ContextPopup(options)
 *
 *  :param options: ``Object`` options
 *
 *  :return:  ``GeoAdmin.ContextPopup``
 *
 *  Create context popup activated on right mouse click.
 */
GeoAdmin.ContextPopup = OpenLayers.Class(OpenLayers.Control, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    /** api: config[qrcode]
     *  ``Boolean``
     * Whether to show a QR code image.
     */
    qrcode: true,
    
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },
    handleRightClicks:true,

    initialize: function(options) {
        this.eventMethods = {
            'rightclick': function(e) {
                var lonlatCH = this.map.getLonLatFromViewPortPx(e.xy);
                this.xy = e.xy;
                var lonlat = lonlatCH.clone();

                var paramsObject = OpenLayers.Util.getParameters(Ext.state.Manager.getProvider().getLink());
                paramsObject.Y = lonlat.lon;
                paramsObject.X = lonlat.lat;
                if (!paramsObject.zoom) {
                    paramsObject.zoom = 0;
                }
                var params = OpenLayers.Util.getParameterString(paramsObject);

                Ext.ux.JSONP.request(GeoAdmin.webServicesUrl + '/height', {
                    callbackKey: "cb",
                    params: {
                        easting: lonlat.lon,
                        northing: lonlat.lat,
                        elevation_model: 'DTM2'
                    },
                    scope: this,
                    callback: function(response) {
                        // Set popup content
                        var lv03Projection = this.map.getProjectionObject();
                        var lv95Projection = new OpenLayers.Projection("EPSG:2056");
                        var wgs84Projection = new OpenLayers.Projection("EPSG:4326");

                        var content = "<table style='font-size: 12px;'><tr><td width=\"110\">" + lv03Projection.proj.title + "</td><td><a href='?" + params + "' target='new'>" + Math.round(lonlat.lon) + " " + Math.round(lonlat.lat) + '</a></td></tr>';

                        lonlat.transform(lv03Projection, lv95Projection);
                        //dirty hack: hard coded text as proj4js does not support + in title..
                        content = content + "<tr><td>" + "CH1903+ / LV95" + "</td><td>" + Math.round(lonlat.lon) + " " + Math.round(lonlat.lat) + '</td></tr>';

                        lonlat = lonlatCH.clone();                        
                        lonlat.transform(lv03Projection, wgs84Projection);
                        content = content + "<tr><td>" + wgs84Projection.proj.title + "</td><td>" + Math.round(lonlat.lon * 100000) / 100000 + " " + Math.round(lonlat.lat * 100000) / 100000 + '</td></tr>';

                        content = content + "<tr><td>" + OpenLayers.i18n('Elevation') + "</td><td>" + response.height.replace('None', '-') + ' [m] </td></tr>';
                        content = content + "<tr><td><div class='ch_bowl'></div></td><td><a href='?crosshair=bowl&" + params + "' target='new'>" + OpenLayers.i18n('Link with bowl crosshair') + "</a></td></tr>";
                        if(this.qrcode){
                            var qrcodeurl = escape("http://map.geo.admin.ch/?crosshair=bowl&"+params);
                            content = content + "<tr><td align='center' colspan='2'><img src='"+GeoAdmin.webServicesUrl+"/qrcodegenerator?url="+qrcodeurl+"' width='128' height='128'/></td></tr>";
                        }
                        content = content + "</table>";
                        if (this.popup) {
                            this.popup.destroy();
                        }
                        this.popup = new GeoExt.Popup({
                            title: OpenLayers.i18n('Position'),
                            location: new OpenLayers.Geometry.Point(this.map.getLonLatFromPixel(this.xy).lon, this.map.getLonLatFromPixel(this.xy).lat),
                            width:270,
                            map: this.map,
                            html: content,
                            maximizable: false,
                            collapsible: false,
                            unpinnable: false,
                            anchorPosition: 'auto',
                            ancCls: 'auto'
                        });
                        this.popup.show();
                    }
                });
            }
        };
        this.handlerOptions = OpenLayers.Util.extend(
        {}, this.defaultHandlerOptions
                );
        OpenLayers.Control.prototype.initialize.apply(
                this, arguments
                );
        this.handler = new OpenLayers.Handler.Click(
                this, this.eventMethods, this.handlerOptions
                );
        this.map.viewPortDiv.oncontextmenu = function(e) {
            e = e ? e : window.event;
            if (e.preventDefault) {
                e.preventDefault(); // For non-IE browsers.
            }
            else {
                return false; // For IE browsers.
            }
        };
        this.map.addControl(this);
        this.activate();     
    }
});
