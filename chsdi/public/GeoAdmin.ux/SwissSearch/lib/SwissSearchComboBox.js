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
    /** config
     */
    url: null,

    defaultZoom: 5,

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
            fields: ['label', 'service', 'bbox', 'objectorig']
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
        // FIXME: check if this.map is valid
        var testRecenter = this.testRecenter(queryEvent.query);

        queryEvent.query = Ext.util.Format.htmlEncode(queryEvent.query);

        return testRecenter;
    },
    
    testRecenter: function(query) {
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
                if (this.map.vector.features !== []) {
                    this.map.vector.removeFeatures(this.map.vector.features[0]);
                }
                var circle = this.createRedCircle(this.map.getCenter());
                this.map.vector.addFeatures([circle]);
                this.pulsate(circle, this.map);
                this.setValue(query);
                this.fireEvent("change", this, "", "");
                return false;
            }
        }

        return true;
    },
    pulsate: function(feature, map) {
        var point = feature.geometry.getCentroid(),
        bounds = feature.geometry.getBounds(),
        radius = Math.abs((bounds.right - bounds.left) / 2),
        count = 0,
        grow = 'up';

        var resize = function() {
            if (count > 16) {
                clearInterval(window.resizeInterval);
            }
            var interval = radius * 0.03;
            var ratio = interval / radius;
            switch (count) {
                case 4:
                case 12:
                    grow = 'down'; break;
                case 8:
                    grow = 'up'; break;
            }
            if (grow !== 'up') {
                ratio = - Math.abs(ratio);
            }
            feature.geometry.resize(1 + ratio, point);
            map.vector.drawFeature(feature);
            count++;
        };
        window.resizeInterval = window.setInterval(resize, 50, point, radius);
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
        } else {
            this.map.setCenter(extent.getCenterLonLat(), zoom);
            if (record.data.service == 'address' || record.data.service === 'swissnames') {
                var circle = this.createRedCircle(extent.getCenterLonLat());
                this.map.vector.addFeatures([circle]);
                this.pulsate(circle, this.map);
            }
        }
    },

    createRedCircle: function(PointCoordinates) {
        var circle = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(
                new OpenLayers.Geometry.Point(PointCoordinates.lon, PointCoordinates.lat),
                12,
                40,
                0
                ),
            {},
            {
                fillColor: '#F00',
                fillOpacity: 0.75,
                strokeWidth: 0
            });
        return circle;
    },
    /** private: method[applyState]
     *  :param state: ``Object`` The state to apply.
     *
     *  Apply the state to the combobox.
     */
    applyState: function(state) {
       this.setValue(state.swisssearch);
       this.fireEvent("change", this, "", "");
       if (state.use_swisssearch && this.testRecenter(this.value)) {
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
                title: OpenLayers.i18n("select one location for" + " " + this.value),
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
