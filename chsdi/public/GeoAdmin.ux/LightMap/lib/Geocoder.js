/*global GeoAdmin:true, OpenLayers: true */

/**
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 * @requires OpenLayers/Geometry.js
 * @requires OpenLayers/Geometry/MultiLineString.js
 * @requires OpenLayers/Format/JSON.js
 * @requires OpenLayers/Format/WKT.js
 * @requires OpenLayers/Protocol/Script.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = Geocoder
 */

/** api: constructor
 *  .. class:: Geocoder(options)
 *
 *  :param options: ``Object`` options
 *
 *   *  Valid properties for the options argument:
 *   * ``map`` - ``OpenLayers.Map`` : map with a "vector" layer
 *   * ``query`` - ``String``: query string to search e.g. "Rue des Berges 37 Payerne"
 *
 *  Class providing the functions necessary geocode addresses.
 */

/** api: example
 *  Sample code to geocode
 *
 *  .. code-block:: javascript
 *
 *      var geocoder = new GeoAdmin.Geocoder({map: map});
 *      geocoder.geocode('Berges 37 Payerne');
 *
 *
 */
GeoAdmin.Geocoder = OpenLayers.Class({

    url: null,
    store: null,
    query: null,
    popup: null,

    /*
     * objectorig to zoom level
     * !! Duplicated code from SwissSearchCombo !!
     */
    objectorig_zoom: {
        'LK500': 4,
        'LK200': 5,
        'LK100': 6,
        'LK50' : 7,
        'LK25' : 8
    },

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    initialize: function(options) {
        if (GeoAdmin.webServicesUrl != null) {
            this.url = GeoAdmin.webServicesUrl + "/swisssearch/geocoding";
        }
        OpenLayers.Util.extend(this, options || {});
        this.scriptProtocol = new OpenLayers.Protocol.Script({
            url: this.url,
            callback: this.geocodeCb,
            callbackKey: 'cb',
            format: new OpenLayers.Format.JSON({
                nativeJSON: false
            }),
            scope: this
        });
        window.geocoderPopup = this;
        // Create div for popup
        this.initPopup();

        if (options.query) {
            this.geocode(options.query);
        }
    },

    initPopup: function() {
        this.popup = document.createElement('div');
        this.popup.style.position = 'fixed';
        this.popup.style.left = '50%';
        this.popup.style.top = '50%';
        this.popup.style.width = '400px';
        this.popup.style.height = '250px';
        this.popup.style.overflow = 'auto';
        this.popup.style.display = 'none';
        this.popup.style.marginLeft = '-200px';
        this.popup.style.marginTop = '-125px';
        this.popup.style.zIndex = '20000';
        this.popup.style.backgroundColor = '#eeeeee';
        document.body.appendChild(this.popup);
    },

    showPopup: function(html) {
        this.popup.innerHTML = html;
        this.popup.style.display = 'block';
    },

    hidePopup: function() {
        this.popup.style.display = 'none';
    },

    geocodeCb: function(response) {
        window.geocoderResults = response.data.results;

        if (response.data.results.length == 0) {
            alert(OpenLayers.i18n("Geocoding failed. No result has been found."))
        }
        if (response.data.results.length == 1) {
            this.centerOnRecord(response.data.results[0]);
        }
        if (response.data.results.length > 1) {
            this.showPopup(this.createResultHtml(response.data.results));
        }
    },

    centerOnRecord: function(record) {
        if (this.map.vector) {
            this.map.vector.removeAllFeatures();
        }
        if (typeof record == 'number') {
            record = window.geocoderResults[record];
        }
        var extent = OpenLayers.Bounds.fromArray(record.bbox);
        var zoom = undefined;
        if (record.service == 'address') {
            zoom = 10;
        } else if (record.service === 'swissnames') {
            zoom = 8;
        } else {
            zoom = this.objectorig_zoom[record.objectorig];
        }

        if (zoom === undefined) {
            this.map.zoomToExtent(extent);
        } else {
            this.map.setCenter(extent.getCenterLonLat(), zoom);
            if (record.service == 'address' || record.service === 'swissnames') {
                var cross = this.createRedCross(extent.getCenterLonLat());
                if (this.map.vector) {
                    this.map.vector.addFeatures([cross]);
                }
            }
        }
    },

    createResultHtml: function(results) {
        var html = '<p style="font-weight:bold;margin-left: 3px">' + OpenLayers.i18n("select one location for") + " " + this.query + '</p>';
        for (var i = 0; i < results.length; i++) {
            html = html + '<a style="margin-left: 3px" href="javascript:window.geocoderPopup.centerOnRecord(' + i + ');window.geocoderPopup.hidePopup();">' + results[i].label + '</a><br>';
        }
        html = html + '<input style="float: right;margin-right: 3px;margin-bottom: 3px;" type="button"" value="' + OpenLayers.i18n('Close') + '" onClick="window.geocoderPopup.hidePopup();">';
        return html;
    },

    // !! Duplicated code from SwissSearchCombo !!
    createRedCross: function(PointCoordinates) {
        var size = 20 * this.map.getResolution() / this.map.getResolutionForZoom(8);
        var offset = size / 2;
        var wkt = "MULTILINESTRING(" +
            "(" + (PointCoordinates.lon - offset) + " " + PointCoordinates.lat + "," + (PointCoordinates.lon - offset - size) + " " + PointCoordinates.lat + ")," +
            "(" + (PointCoordinates.lon + offset) + " " + PointCoordinates.lat + "," + (PointCoordinates.lon + offset + size) + " " + PointCoordinates.lat + ")," +
            "(" + PointCoordinates.lon + " " + (PointCoordinates.lat - offset - size) + "," + PointCoordinates.lon + " " + (PointCoordinates.lat - offset) + ")," +
            "(" + PointCoordinates.lon + " " + (PointCoordinates.lat + offset + size) + "," + PointCoordinates.lon + " " + (PointCoordinates.lat + offset) + ")" +

            ")";
        var geom = OpenLayers.Geometry.fromWKT(wkt);
        var cross = new OpenLayers.Feature.Vector(geom, {}, {strokeColor: 'red', strokeWidth: 2.0, strokeOpacity: 1, strokeDashstyle: 'solid', strokeLinecap: 'round'});
        return cross;

    },

    /** api: method[geocode]
     *  :param query: ``String``: the query parameter to search
     *
     *  Recenter the map according to a query parameter (address (only for swiss confederation offices), location, city, canton etc...)
     */
    geocode: function(query) {
        this.query = query;

        this.scriptProtocol.read({
            params: {
                query: query,
                lang: OpenLayers.Lang.getCode()
            }
        });
    }

});