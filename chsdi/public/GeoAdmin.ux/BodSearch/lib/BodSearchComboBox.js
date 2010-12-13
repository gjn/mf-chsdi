/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @requires OpenLayers/Lang.js
 * @requires BodSearch/lib/BodSearchWindow.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = BodSearchComboBox
 *  base_link = `Ext.form.ComboBox <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */

/** api: example
 *  Sample code to create a bod search combo (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples1.html#bod-search>`_)
 *
 *  .. code-block:: javascript
 *
 *     var bodSearch = new GeoAdmin.BodSearchComboBox({
 *       width: 500,
 *       renderTo: "searchdiv",
 *       map: map
 *    });
 *
 *
 */

/** api: constructor
 *  .. class:: BodSearchComboBox(config)
 *
 *  :return: ``GeoAdmin.BodSearchComboBox``
 *
 *  Create a ComboBox to search through available layers. BOD means "Betriebsobjektdatenbank".
 */

GeoAdmin.BodSearchComboBox = Ext.extend(Ext.form.ComboBox, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    /** api: config[redirectUrl]
     *  ``String``
     *  Address of the target map where to open the selected layer. Default value: "http://map.geo.admin.ch/?layers={0}&lang={1}".
     */
    redirectUrl: "http://map.geo.admin.ch/?layers={0}&lang={1}",

    /** api: config[lang]
     *  ``String``
     *  Language. Default value: 'de'. Other possible values: 'it', 'fr', 'fi' (for rumantsch) or 'en'
     */
    lang: null,

    url: null,
    hideTrigger: true,
    minChars: 4,
    queryDelay: 50,
    listWidth: 500,
    displayField: 'label',
    forceSelection: true,

    initComponent: function() {
        this.emptyText = OpenLayers.i18n('Search data...');

        if (!this.url && GeoAdmin.webServicesUrl !== null) {
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

/** api: xtype = ga_bodsearchcombo */
Ext.reg("ga_bodsearchcombo", GeoAdmin.BodSearchComboBox);
