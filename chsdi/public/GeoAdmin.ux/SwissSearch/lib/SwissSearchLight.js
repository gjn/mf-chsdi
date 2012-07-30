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
 *  class = SwissSearchCombo
 */

/** api: constructor
 *  .. class:: SwissSearchCombo(div,options)
 *
 *  :param div:    ``String`` The element where the map will be rendered (or the id for that element).
 *  :param config: ``Object`` options (optional).
 *
 *  Class providing the functions necessary search for locations.
 *  Only one combo can be placed in one page
 */

/** api: example
 *  Sample code to add a Swiss Search Combo
 *
 *  .. code-block:: javascript
 *
 *      var geocoder = new GeoAdmin.SwissSearchCombo('mydiv',{map: map});
 *
 *
 */
GeoAdmin.SwissSearchCombo = OpenLayers.Class({
    // GeoCoding URL
    url: null,
    // Input element
    inputElement: null,
    // Autocompletion div element
    autoCompletion: null,
    // Div name where the input is placed
    div: null,

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

    initialize: function(div, options) {
        if (GeoAdmin.webServicesUrl != null) {
            this.url = GeoAdmin.webServicesUrl + "/swisssearch/geocoding";
        }
        this.div = OpenLayers.Util.getElement(div);

        this.map = options.map;
                          
        OpenLayers.Element.addClass(this.div, 'geoadmin-swisssearchlight');
        this.scriptProtocol = new OpenLayers.Protocol.Script({
            url: this.url,
            callback: this.geocodeCb,
            callbackKey: 'cb',
            format: new OpenLayers.Format.JSON({
                nativeJSON: false
            }),
            scope: this
        });
        // Create input field
        this.inputElement = document.createElement('input');
        this.inputElement.setAttribute('id','geoadmin-swisssearchlight-input');
        this.inputElement.setAttribute('value', OpenLayers.i18n('Geo search...'));
        if (this.div.style && this.div.style.width) {
            this.inputElement.style.width = this.div.style.width;
        }
        this.div.appendChild(this.inputElement);

        /* Doesnt work in IE, but kept for the record
         this.inputElement.onkeyup = (function(event) {
         var tm;
         return function(event) {
         this.autoCompletion.style.display = 'block';
         this.autoCompletion.innerHTML = OpenLayers.i18n("Searching...");
         var me = this;
         clearTimeout(tm);
         tm = setTimeout(function() {
         me.onkeyupdelay()
         }, 250);
         }
         })().bind(this);
         this.onkeyupdelay = function() {
         var myInputValue = document.getElementById(this.div.id).firstChild.value;
         this.scriptProtocol.read({
         params: {
         query: myInputValue,
         lang: OpenLayers.Lang.getCode()
         }
         });
         };
         */
        this.inputElement.onkeyup = function(event) {
            window.swissSearchCombo.autoCompletion.style.display = 'block';
            window.swissSearchCombo.autoCompletion.innerHTML = OpenLayers.i18n("Searching...");
            clearTimeout(window.swissSearchCombo.tm);
            window.swissSearchCombo.tm = setTimeout(function() {
                window.swissSearchCombo.onkeyupdelay()
            }, 250);
        };
        this.onkeyupdelay = function() {
            var myInputValue = document.getElementById('geoadmin-swisssearchlight-input').value;
            window.swissSearchCombo.scriptProtocol.read({
                params: {
                    query: myInputValue,
                    lang: OpenLayers.Lang.getCode()
                }
            });
        };

        // Create autocompletion div
        this.autoCompletion = document.createElement('div');
        this.autoCompletion.className = "autocompletion";
        this.autoCompletion.style.width = this.inputElement.style.width;
        var myTop = this.getPositionTop(this.inputElement) + 25;
        this.autoCompletion.style.top = myTop + "px";
        this.autoCompletion.style.left = this.getPositionLeft(this.inputElement) + "px";
        document.body.appendChild(this.autoCompletion);
        // Create a global variable due to scope issues in IE
        window.swissSearchCombo = this;
        window.swissSearchCombo.tm = null;
        document.body.onclick = function(event) {
            window.swissSearchCombo.hideAutocompletion();
            clearTimeout(window.swissSearchCombo.tm);
        }

    },

    getPositionTop: function(obj) {
        var topValue = 0;
        while (obj) {
            topValue += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return topValue;
    },

    getPositionLeft: function(obj) {
        var leftValue = 0;
        while (obj) {
            leftValue += obj.offsetLeft;
            obj = obj.offsetParent;
        }
        return leftValue;
    },

    geocodeCb: function(response) {
        window.swissSearchResults = response.data.results;
        if (response.data.results.length == 0) {
            window.swissSearchCombo.autoCompletion.style.display = 'none';
        } else {
            window.swissSearchCombo.autoCompletion.style.display = 'block';
            window.swissSearchCombo.autoCompletion.innerHTML = window.swissSearchCombo.createResultHtml(response.data.results);
        }
    },


    centerOnRecord: function(record) {
        var that = window.swissSearchCombo;
        if (that.map.vector) {
            that.map.vector.removeAllFeatures();
        }
        if (typeof record == 'number') {
            record = window.swissSearchResults[record];
        }
        var extent = OpenLayers.Bounds.fromArray(record.bbox);
        var zoom = undefined;
        if (record.service == 'address') {
            zoom = 10;
        } else if (record.service === 'swissnames') {
            zoom = 8;
        } else {
            zoom = that.objectorig_zoom[record.objectorig];
        }

        if (zoom === undefined) {
            that.map.zoomToExtent(extent);
        } else {
            that.map.setCenter(extent.getCenterLonLat(), zoom);
            if (record.service == 'address' || record.service === 'swissnames') {
                var cross = that.createRedCross(extent.getCenterLonLat());
                if (that.map.vector) {
                    that.map.vector.addFeatures([cross]);
                }
            }
        }
    },

    createResultHtml: function(results) {
        var html = '';
        for (var i = 0; i < results.length; i++) {
            html = html + '<a style="margin-left: 3px" href="#" onclick="window.swissSearchCombo.centerOnRecord(' + i + ');window.swissSearchCombo.hideAutocompletion();">' + results[i].label + '</a><br>';
        }
        return html;
    },

    hideAutocompletion: function() {
        window.swissSearchCombo.autoCompletion.style.display = 'none';
        window.swissSearchCombo.autoCompletion.innerHTML = '';
        document.getElementById('geoadmin-swisssearchlight-input').value ='';
    },

    // !! Duplicated code from SwissSearchCombo !!
    createRedCross: function(PointCoordinates) {
        var that = window.swissSearchCombo;
        var size = 20 * that.map.getResolution() / that.map.getResolutionForZoom(8);
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

    }

});
