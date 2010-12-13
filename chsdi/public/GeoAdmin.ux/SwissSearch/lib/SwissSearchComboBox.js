/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 *
 * @include proj4js/lib/defs/EPSG21781.js
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
            this.url = GeoAdmin.webServicesUrl + "/swisssearch";
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
    onSelect: function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.get('label').replace(/<[\/]?[^>]*>/g, ''));
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    onBeforeQuery: function(queryEvent) {
        // FIXME: check if this.map is valid
        var match = queryEvent.query.match(this.coordRegExp);
        if (match) {
            var left = parseFloat(match[1].replace("'", ""));
            var right = parseFloat(match[2].replace("'", ""));

            // in EPSG:21781 lon is always bigger than lat
            var position = new OpenLayers.LonLat(left > right ? left : right, right < left ? right : left);
            var valid = false;
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
            if (valid) {
                this.map.setCenter(position, this.defaultZoom);
                return false;
            }
        }
        return true;
    },

    recordSelected: function(combo, record, index) {
        var extent = OpenLayers.Bounds.fromArray(record.get('bbox'));
        var zoom = this.objectorig_zoom[record.get('objectorig')];

        if (zoom === undefined) {
            this.map.zoomToExtent(extent);
        } else {
            this.map.setCenter(extent.getCenterLonLat(), zoom);
        }
    }
});

/** api: xtype = ga_swisssearchcombo */
Ext.reg("ga_swisssearchcombo", GeoAdmin.SwissSearchComboBox);

Ext.reg("ga_swisssearch", GeoAdmin.SwissSearchComboBox);
