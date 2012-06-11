/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 *
 * @include proj4js/lib/defs/EPSG21781.js
 * This is a workaround since Proj4JS doesn't support it (http://trac.osgeo.org/proj4js/ticket/55):
 * @include Map/lib/EPSG2056.js
 */
/** api: (define)
 *  module = GeoAdmin
 *  class = SwissSearchComboBox
 *  base_link = `Ext.form.ComboBox <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */

/** api: example
 *  Sample code to swisssearch combo (see also :ref:`swiss-search`):
 *
 *  .. code-block:: javascript

 *     var map4 = new GeoAdmin.Map("mymap4", {doZoomToMaxExtent: true});
 *     map4.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
 *     var swisssearch = new GeoAdmin.SwissSearchComboBox({
 *         width: 500,
 *         renderTo: "mysearch4",
 *         map: map4
 *        });
 *
 *
 */

/** api: constructor
 *  .. class:: SwissSearchComboBox(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.SwissSearchComboBox``
 *
 *  Create a swiss search combo box
 *  The swiss search combo searches within various data sets:
 *   - cities
 *   - swissnames
 *   - districts
 *   - cantons
 *   - postalcodes
 *   - address (only for *.admin.ch domains)
 *   - parcel (if Cadastral Web Map layer is visible)
 *  Some layers are searchable. In this case, the swiss search combo will search within the visible layers.
 */
GeoAdmin.SwissSearchComboBox = Ext.extend(Ext.form.ComboBox, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,
    /** api: config[stateId]
     * ``String`` The state id. Default value is "swisssearch"
     *
     */
    stateId: "swisssearch",
    /** private: property[stateEvents]
     *  ``Array(String)`` Array of state events.
     */
    stateEvents: ["beforequery", "select", "change"],

    stateful: true,

    url: null,

    /** api: config[attributesSearch]
     *  ``Boolean``
     *  Defines if swisssearch also search within visible layer. Default: false
     */
    attributesSearch: false,

    // default Ext.form.ComboBox config
    hideTrigger: true,
    minChars: 2,
    queryDelay: 50,
    displayField: 'label',
    forceSelection: true,
    selectOnFocus: true,
    listeners:{
        render: function() {
            this.el.set(
                {'ext:qtip':OpenLayers.i18n('searchQuicktip'),
                    'ext:qwidth':400}
            );
        }
    },

    coordRegExp: /([\d\.']+)[\s,]+([\d\.']+)/,

    /*
     * objectorig to zoom levle
     */
    objectorig_zoom: {
        'LK500': 4,
        'LK200': 5,
        'LK100': 6,
        'LK50' : 7,
        'LK25' : 8
    },

    initComponent: function() {
        // i18n
        this.emptyText = OpenLayers.i18n("Geo search...");

        if (!this.url && GeoAdmin.webServicesUrl != null) {
            this.url = GeoAdmin.webServicesUrl + "/swisssearch/geocoding";
        }
        this.store = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                url: this.url,
                method: 'GET',
                callbackParam: 'cb',
                nocache: false,
                autoAbort: true
            }),
            baseParams: {
                lang: OpenLayers.Lang.getCode()
            },
            root: 'results',
            fields: ['label', 'service', 'bbox', 'objectorig', 'Y', 'X', 'name']
        });
        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="x-combo-list-item {service}">',
            '{label}',
            '</div></tpl>').compile();

        GeoAdmin.SwissSearchComboBox.superclass.initComponent.call(this);

        this.on("beforequery", this.onBeforeQuery, this);
        this.on("select", this.recordSelected, this);
    },

    // private
    onSelect: function(record, index) {
        this.map.vector.removeAllFeatures();
        if (this.fireEvent('beforeselect', this, record, index) !== false) {
            this.setValue(record.get('label').replace(/<[\/]?[^>]*>/g, ''));
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    onBeforeQuery: function(queryEvent) {
        if (this.map && this.attributesSearch) {
            var layers = [];
            for (var l in this.map.layers) {
                var layer = this.map.layers[l];
                var  name = layer.layer || layer.layername;
                if (name && layer.visibility && layer.geoadmin_searchable) layers.push(name);
            }
            this.store.baseParams.layers = layers.join(',');
        }
        var testRecenter = this.testRecenter(queryEvent.query);

        // Search parcel only if the parcel layer is visible
        this.store.baseParams.services = 'cities,swissnames,districts,cantons,postalcodes,address';
        if (this.map) {
            for (var l in this.map.layers) {
                var layer = this.map.layers[l].layer;
                if (layer == 'ch.kantone.cadastralwebmap-farbe' || layer == 'ch.kantone.hintergrund-farbe') {
                    this.store.baseParams.services = 'cities,swissnames,districts,cantons,postalcodes,address,parcel';
                    break;
                }
            }
        }

        queryEvent.query = Ext.util.Format.htmlEncode(queryEvent.query);

        return testRecenter;
    },

    testRecenter: function(query, onlyTest) {
        var match = query.match(this.coordRegExp);

        if (match) {
            var left = parseFloat(match[1].replace("'", ""));
            var right = parseFloat(match[2].replace("'", ""));

            // in EPSG:21781 lon is always bigger than lat
            var position = new OpenLayers.LonLat(left > right ? left : right, right < left ? right : left);
            var valid = false;
            if (this.map.maxExtent.containsLonLat(position)) {
                valid = true;
            } else {
                // try to convert the position from EPSG:2056 to EPSG:21781
                position.transform(new OpenLayers.Projection("EPSG:2056"), this.map.getProjectionObject());
                if (this.map.maxExtent.containsLonLat(position)) {
                    valid = true;
                } else {
                    // try to convert the position from EPSG:4326 to EPSG:21781
                    position = new OpenLayers.LonLat(left < right ? left : right, right > left ? right : left);
                    position.transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
                    if (this.map.maxExtent.containsLonLat(position)) {
                        valid = true;
                    }
                }
            }
            if (valid) {
                var zoomReverse = 8;
                this.map.setCenter(position, zoomReverse);
                if (this.map.vector.features.length > 0) {
                    this.map.vector.removeFeatures(this.map.vector.features);
                }
                if (!onlyTest) {
                    var cross = this.createRedCross(this.map.getCenter());
                    this.map.vector.addFeatures([cross]);
                    this.setValue(query);
                    this.fireEvent("change", this, "", "");
                } else {
                    alert(OpenLayers.i18n("Use Y,X with zoom instead of swisssearch in the permalink when you want to recenter the map, something like:") + " ?Y=" + position.lon + "&X=" + position.lat);
                }
                return false;
            }
        }

        return true;
    },

    recordSelected: function(combo, record, index) {
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
            if (record.data.service == 'parcel') {
                var labelGeometry = new OpenLayers.Geometry.Point(record.data.Y, record.data.X);
                var label = new OpenLayers.Feature.Vector(labelGeometry, {}, {label: record.data.name, labelOutlineColor: "white", labelOutlineWidth: 3, fontStyle: 'italic', fontWeight: 'bold', stroke: true, fontColor: '#ff0000'})
                this.map.vector.addFeatures([label]);
            }
        } else {
            this.map.setCenter(extent.getCenterLonLat(), zoom);
            if (record.data.service == 'address' || record.data.service === 'swissnames') {
                var cross = this.createRedCross(extent.getCenterLonLat());
                this.map.vector.addFeatures([cross]);
            }
        }
    },

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

    /** private: method[applyState]
     *  :param state: ``Object`` The state to apply.
     *
     *  Apply the state to the combobox.
     */
    applyState: function(state) {
        this.setValue(state.swisssearch);
        this.fireEvent("change", this, "", "");
        if (state.use_swisssearch && this.testRecenter(state.swisssearch, true)) {
            this.store.load({params: {query: this.value},callback: this.permalinkCallback ,scope: this});
        }
    },

    permalinkCallback: function(r, options, success) {
        if (success) {
            if (r.length == 0) {
                this.clearValue();
            }
            if (r.length == 1) {
                this.setValue(r[0].data.label.replace(/<[\/]?[^>]*>/g, ''));
                this.fireEvent("change", this, "", "");
                this.recordSelected(null, r[0], null);
            }
            if (r.length > 1) {
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
                                this.map.vector.removeAllFeatures();
                                this.recordSelected(null, r, null);
                                this.setValue(r.data.label.replace(/<[\/]?[^>]*>/g, ''));
                                this.fireEvent("change", this, "", "");
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
                    title: OpenLayers.i18n("select one location for") + " " + this.value,
                    items: [grid]
                });
                this.selectWindow.show();
            }
        }
    },

    /** private: method[getState]
     *  :return: ``Object`` The state.
     *
     *  Returns the state of the swisssearch combo.
     */
    getState: function() {
        //return {swisssearch: this.value};
    }
});

/** api: xtype = ga_swisssearchcombo */
Ext.reg("ga_swisssearchcombo", GeoAdmin.SwissSearchComboBox);

Ext.reg("ga_swisssearch", GeoAdmin.SwissSearchComboBox);

Ext.apply(Ext.QuickTips.getQuickTip(), {
    showDelay: 50,      // Show 50ms after entering target
    dismissDelay: 10000,
    trackMouse: true
});
