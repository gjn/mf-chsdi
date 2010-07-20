/*global GeoAdmin:true, OpenLayers: true, Ext:true */

GeoAdmin.BodSearchComboBox = Ext.extend(Ext.form.ComboBox, {
    map: null,

    // default Ext.form.ComboBox config
    hideTrigger: true,
    minChars: 4,
    queryDelay: 50,
    emptyText: OpenLayers.i18n('Search data...'),
    loadingText: OpenLayers.i18n('loadingText'),
    displayField: 'label',
    forceSelection: true,

    initComponent: function() {
        this.store = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                url: GeoAdmin.webServicesUrl + '/bodsearch',
                method: 'GET',
                nocache: false
            }),
            baseParams: {
                lang: OpenLayers.Lang.getCode()
            },
            root: 'results',
            fields: ['id', 'label', 'datenherr', 'content']
        });
        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="x-combo-list-item bodsearch">',
            '{content}',
            '</div></tpl>'
        ).compile();

        GeoAdmin.BodSearchComboBox.superclass.initComponent.call(this);
        this.on('select', this.recordSelected, this);
    },

    recordSelected: function(combo, record, index) {
        this.map.addLayerByName(record.get('id'));
    }
});
