/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @requires OpenLayers/Lang.js
 * @requires BodSearch/lib/BodSearchWindow.js
 */
GeoAdmin.BodSearchComboBox = Ext.extend(Ext.form.ComboBox, {

    /*
     * {<OpenLayers.Map>}
     */
    map: null,

    /*
     * {String}
     */
    url: null,

    /*
     * {String}
     */
    redirectUrl: "http://map.geo.admin.ch/?layers={0}&lang={1}",

    /*
     * {String}
     */
    lang: null,

    // default Ext.form.ComboBox config
    hideTrigger: true,
    minChars: 4,
    queryDelay: 50,
    listWidth: 500,
    displayField: 'label',
    forceSelection: true,

    initComponent: function() {
        // i18n
        this.emptyText = OpenLayers.i18n('Search data...');

        if (!this.url && GeoAdmin.webServicesUrl != null) {
            this.url = GeoAdmin.webServicesUrl + '/bodsearch/search';
        }
        this.store = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                url: this.url,
                callbackParam: 'cb',
                method: 'GET',
                nocache: false,
                autoAbort: true
            }),
            root: 'results',
            fields: ['id', 'label', 'datenherr', 'content']
        });

        var info = '';
        if (this.map) {
            info = ["<div class='bodsearch-details' ",
                    "     onclick='GeoAdmin.BodSearchWindow.show(\"{id}\")'>",
                    "</div>"].join('');
        }

        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="x-combo-list-item bodsearch">',
            info,
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
        } else if (this.redirectUrl) {
            window.open(String.format(this.redirectUrl, id, this.lang));
        }
    }
});

Ext.reg("ga_bodsearchcombo", GeoAdmin.BodSearchComboBox);
