/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

Ext.namespace("GeoAdmin");

GeoAdmin.ThemesCombo = Ext.extend(Ext.form.ComboBox, {
    
    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,
    
    forceSelection: true,
    
    /* Populate and autoselect the remainder of the text being typed if it matches a known value */
    typeAhead: true,
    
    /* The combo box loads local data */
    mode: 'local',
    
    editable: false,
    
    triggerAction: 'all',

    autoScroll: true,

    maxHeight: 150,
    
    /* Define a title (optional), an image (optional) and a state (based on the class OpenLayers.Map.prototype.applyState) */
    themes: null,

    initComponent: function(config) {

        this.store = new Ext.data.ArrayStore({
            data: this.themes,
            fields: ['title', 'image', 'state']
        });

        this.tpl = new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item">',
                '<div style="width: 70%; float: left;">{title}<br>',
                'Here is a little description </div>',
                '<div style="padding: 10px; float: right; "><img src="' + OpenLayers.ImgPath + '{image}" style="vertical-align: middle;"></div>',
                '</div>',
                '</div></tpl>').compile();
        
        this.itemSelector = 'div.x-combo-list-item';
        
        this.displayField = 'title';
        
        this.on('select', function(combo, record, index) {
             this.map.vector.removeAllFeatures();
             var state = this.map.getState();
             // Remove the previous layers
             for (var i = 0, len = state.layers.length; i < len; i++) {
                 var layername = state.layers[i].layername;
                 this.map.removeLayerByName(layername);
             }
            this.map.applyState(record.data.state);
        });
               
        GeoAdmin.ThemesCombo.superclass.initComponent.call(this);
    }
})

/** api: xtype = ga_themescombo */
Ext.reg("ga_themescombo", GeoAdmin.ThemesCombo);
