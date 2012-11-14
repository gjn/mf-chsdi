/*global GeoAdmin:true, OpenLayers: true, Ext:true */

Ext.ns("GeoAdmin");

/**
 * @include GeoExt/widgets/LayerOpacitySlider.js
 * @include OpenLayers/Lang.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class  = BaseLayerTool
 *  base_link = `Ext.Container <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Container>`_
 */

/** api: example
 *  Sample code to create a base layer tool (see also `demo <//api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples1.html#base-layer-tool>`_):
 *
 *  .. code-block:: javascript
 * 
 *     var baseLayerTool = new GeoAdmin.BaseLayerTool({
 *           map: new GeoAdmin.Map('mymap'), 
 *           renderTo: "baselayertool"
 *     })
 *
 *
 */

/** api: constructor
  *  .. class:: BaseLayerTool(config)
  *
  *  :param config: ``Object`` config
  * 
  *  :return:  ``GeoAdmin.BaseLayerTool``
  *
  *  The base layer tool allows the user to manage the base layer (swissimage, pixelmap and void). It offers an opacity slider and the possibility to switch between pixelmaps and void layers.
  */
GeoAdmin.BaseLayerTool = Ext.extend(Ext.Container, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,
    
    /** api: config[slider]
     *  ``Object``
     *  An options object used for the configuration of the `GeoExt.LayerOpacitySlider <http://www.geoext.org/lib/GeoExt/widgets/LayerOpacitySlider.html>`_
     */
    slider: null,
    
    /** api: config[combo]
     *  ``Object``
     *  An options object used for the configuration of the `Ext.form.ComboBox <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_ 
     */
    combo: null,

    layout: 'column',
    
    cls: 'geoadmin-baselayertool',

    initComponent: function() {
        var label = this.createLabel(this.label);
        delete this.label;

        this._slider = this.createOpacitySlider(this.slider);
        delete this.slider;

        this._combo = this.createLayersCombo(this.combo, this._slider);
        delete this.combo;
    
        this.map.events.on({
            changecomplementarylayer: function(evt) {
                this._slider.setLayer(evt.layer);
                this._combo.setValue(evt.layer.name);
            },
            scope: this
        });

        this.items = [label, this._slider, this._combo];

        GeoAdmin.BaseLayerTool.superclass.initComponent.apply(this, arguments);
    },

    createLabel: function(label) {
        label = label || OpenLayers.i18n('Aerial');
        return new Ext.BoxComponent({
            html: '<span class="geoadmin-baselayertool-label x-unselectable">' + label + '</span>'
        });
    },

    createOpacitySlider: function(options) {
        options = Ext.apply({
            layer: this.map.complementaryLayer,
            aggressive: true,
            style: {
                margin: "0px 3px"
            },
            width: 200
        }, options);
        return new GeoExt.LayerOpacitySlider(options);
    },

    createLayersCombo: function(options, slider) {
        options = options || {};

        var layers = options.layers || [
            "ch.swisstopo.pixelkarte-farbe",
            "ch.swisstopo.pixelkarte-grau",
            "ch.kantone.hintergrund-farbe",
            "ch.swisstopo.tml3d-hintergrund-karte",
            "voidLayer"
        ];

        var data = [], id;
        for (var i = 0, len = layers.length; i < len; i++) {
            id = layers[i];
            if (GeoAdmin.layers.layers[id]) {
                data.push([id, GeoAdmin.layers.layers[id].name]);
            }
        }
        var store = new Ext.data.SimpleStore({
            fields: ['id', 'name'],
            data: data
        });

        options = Ext.apply({
            editable: false,
            hideLabel: true,
            width: 140,
            store: store,
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            triggerAction: 'all',
            mode: 'local',
            value: GeoAdmin.layers.layers[this.map.complementaryLayer.layername].name,
            listeners: {
                select: function(combo, record, index) {
                    var complementaryLayer = this.map.switchComplementaryLayer(record.data.id);
                    this._slider.setLayer(complementaryLayer);
                },
                scope: this
            }
        }, options);

        return new Ext.form.ComboBox(options);
    }
});

/** api: xtype = ga_baselayertool */
Ext.reg("ga_baselayertool", GeoAdmin.BaseLayerTool);
