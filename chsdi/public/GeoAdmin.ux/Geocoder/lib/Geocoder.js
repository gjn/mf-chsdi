/*global GeoAdmin:true, OpenLayers: true */

/**
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
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
        if (options.query) {
            this.geocode(options.query);
        }
    },

    geocodeCb: function(response) {
        var reader = new Ext.data.JsonReader({
            root: 'results',
            fields: ['label', 'service', 'bbox', 'objectorig']});
        var records = reader.readRecords(response);
        this.store = new Ext.data.Store({reader: reader});
        this.store.loadData(reader.jsonData);
        if (this.store.totalLength == 0) {
            Ext.MessageBox.show({
               title: OpenLayers.i18n("No result"),
               msg: OpenLayers.i18n("Geocoding failed. No result has been found.")
            })
        }
        if (this.store.totalLength == 1) {
            var record = this.store.getAt(0);
            this.centerOnRecord(record);

        }
        if (this.store.totalLength > 1) {
            // !! Duplicated code from SwissSearchCombo !!
            var grid = new Ext.grid.GridPanel({
                store: this.store,
                hideHeaders: true,
                colModel: new Ext.grid.ColumnModel({
                    columns: [
                        {id: 'label', header: OpenLayers.i18n('Name'), sortable: true, dataIndex: 'label'}
                    ]
                }),
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:true,
                    listeners: {
                        rowselect: function(smObj, rowIndex, r) {
                            if (this.map.vector) {
                                this.map.vector.removeAllFeatures();
                            }
                            this.centerOnRecord(r);
                            this.selectWindow.hide();
                        },
                        scope: this
                    }
                }),
                viewConfig: {forceFit: true}
            });
            this.selectWindow = new Ext.Window({
                width: 400,
                height: 300,
                autoScroll: true,
                modal: true,
                layout: 'fit',
                title: OpenLayers.i18n("select one location for") + " " + this.query,
                items: [grid]
            });
            this.selectWindow.show();

        }
    },

    // !! Duplicated code from SwissSearchCombo !!
    centerOnRecord: function(record) {
        // !! Duplicated code from SwissSearchCombo !!
        var extent = OpenLayers.Bounds.fromArray(record.data.bbox);
        var zoom = undefined;
        if (record.data.service == 'address') {
            zoom = 10;
        } else if (record.data.service === 'swissnames') {
            zoom = 8;
        } else {
            zoom = this.objectorig_zoom[record.data.objectorig];
        }

        if (zoom === undefined) {
            this.map.zoomToExtent(extent);
        } else {
            this.map.setCenter(extent.getCenterLonLat(), zoom);
            if (record.data.service == 'address' || record.data.service === 'swissnames') {
                var cross = this.createRedCross(extent.getCenterLonLat());
                if (this.map.vector) {
                    this.map.vector.addFeatures([cross]);
                }
            }
        }
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
        Ext.ux.JSONP.request(this.url, {
            callbackKey: "cb",
            params: {
                query: query,
                lang: OpenLayers.Lang.getCode()
            },
            scope: this,
            callback: this.geocodeCb
        });
    }

});