/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 */

GeoAdmin.BodSearchComboBox = Ext.extend(Ext.form.ComboBox, {

    /*
     * {<OpenLayers.Map>}
     */
    map: null,

    /*
     * {String}
     */
    url: "http://map.geo.admin.ch/?layers={0}&lang={1}",

    /*
     * {String}
     */
    lang: null,

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
            root: 'results',
            fields: ['id', 'label', 'datenherr', 'content']
        });
        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="x-combo-list-item bodsearch">',
            '{content}',
            '</div></tpl>'
        ).compile();

        GeoAdmin.BodSearchComboBox.superclass.initComponent.call(this);
        this.lang = this.lang || OpenLayers.Lang.getCode();

        this.store.baseParams = {
          lang: this.lang
        };

        this.on('select', this.recordSelected, this);
    },

    recordSelected: function(combo, record, index) {
        var id = record.get('id');
        if (this.map) {
            this.map.addLayerByName(id);
        } else if (this.url) {
            window.open(String.format(this.url, id, this.lang));
        }
    }
});
